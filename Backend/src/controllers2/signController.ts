import { Request, Response } from "express";
import { FileType, PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import QRCode from "qrcode";

const prisma = new PrismaClient();
// Load RSA keys dari file
const privateKeyPath = path.resolve(__dirname, "../generate-key/private.pem");
const privateKey = fs.readFileSync(privateKeyPath);
const publicKeyPath = path.resolve(__dirname, "../generate-key/public.pem");
const publicKey = fs.readFileSync(publicKeyPath);

export const generateSignature = async (req: Request, res: Response) => {
  const { userId, fileType, relatedId, role } = req.body;

  if (!userId || !fileType || !relatedId || !role) {
    res.status(400).json({
      message: "userId, fileType, relatedId, and signature are required.",
    });
    return;
  }

  const data = JSON.stringify(req.body);
  try {
    // Validasi apakah dokumen dengan relatedId benar-benar ada sesuai fileType
    const fileExists = await validateRelatedFileExists(
      fileType,
      Number(relatedId)
    );
    if (!fileExists) {
      res.status(404).json({
        message: `Document with ID ${relatedId} not found for type ${fileType}.`,
      });
      return;
    }

    // Pastikan user memiliki kewenangan menandatangani jenis dokumen ini
    const authority = await prisma.signingAuthority.findUnique({
      where: {
        userId_fileType_role: {
          userId: Number(userId),
          fileType,
          role,
        },
      },
    });

    if (!authority) {
      res.status(403).json({
        message: "User does not have signing authority for this document type.",
      });
      return;
    }

    // Upsert SignedFile (satu dokumen hanya sekali di-entry berdasarkan tipe dan ID)
    const signedFile = await prisma.signedFile.upsert({
      where: {
        type_relatedId: {
          type: fileType as FileType,
          relatedId: Number(relatedId),
        },
      },
      update: {},
      create: {
        type: fileType,
        relatedId: Number(relatedId),
      },
    });

    // Tanda tangani data
    const signature = crypto
      .sign("sha256", Buffer.from(data), {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      })
      .toString("base64");

    // Gabungkan data + signature
    const signedPayload = {
      data: req.body,
      date: new Date().toISOString(),
      signature,
    };

    // Generate QR Code dari payload JSON
    const qrString = JSON.stringify(signedPayload);
    const qrCodeDataURL = await QRCode.toDataURL(qrString);

    // Tambahkan tanda tangan baru
    const signedBy = await prisma.signedBy.create({
      data: {
        signedFileId: signedFile.id,
        userId: Number(userId),
        role: authority.role, 
        signature: qrCodeDataURL,
      },
    });

    res.json({ message: "File signed successfully", signedBy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to sign file." });
  }
};

export const getSigningStatus = async (req: Request, res: Response) => {
  const { fileType, relatedId } = req.params;

  try {
    const signedFile = await prisma.signedFile.findUnique({
      where: {
        type_relatedId: {
          type: fileType as FileType,
          relatedId: Number(relatedId),
        },
      },
      include: {
        SignedBy: {
          include: { User: true },
        },
      },
    });

    if (!signedFile) {
      res.status(404).json({ message: "Belum ada tanda tangan." });
      return;
    }

    const result = signedFile.SignedBy.map((entry: any) => ({
      userId: entry.userId,
      userName: entry.User.fullName,
      role: entry.role,
      signedAt: entry.createdAt,
      qrCode: entry.signature, // ini sudah berupa data:image/png;base64,...
    }));

    res.json({ totalSigned: result.length, signatures: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil status tanda tangan." });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { data, signature } = req.body;

    const isVerified = crypto.verify(
      "sha256",
      Buffer.from(JSON.stringify(data)),
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature, "base64")
    );

    res.json({ verified: isVerified });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};

async function validateRelatedFileExists(
  fileType: FileType,
  relatedId: number
) {
  switch (fileType) {
    case "PERMINTAAN_LAPANGAN":
      return (
        (await prisma.permintaanLapangan.findUnique({
          where: { id: relatedId },
        })) !== null
      );
    case "CONFIRMATION_ORDER":
      return (
        (await prisma.confirmationOrder.findUnique({
          where: { id: relatedId },
        })) !== null
      );
    case "PURCHASE_ORDER":
      return (
        (await prisma.purchaseOrder.findUnique({
          where: { id: relatedId },
        })) !== null
      );
    default:
      return false;
  }
}
