import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import QRCode from "qrcode";

// Load RSA keys dari file
const privateKeyPath = path.resolve(__dirname, "../generate-key/private.pem");
const privateKey = fs.readFileSync(privateKeyPath);
const publicKeyPath = path.resolve(__dirname, "../generate-key/public.pem");
const publicKey = fs.readFileSync(publicKeyPath);

export const generate = async (req: Request, res: Response) => {
  try {
    const data = JSON.stringify(req.body);

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
      signature,
    };

    // Generate QR Code dari payload JSON
    const qrString = JSON.stringify(signedPayload);
    const qrCodeDataURL = await QRCode.toDataURL(qrString);

    res.json({ qrCode: qrCodeDataURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate QR code" });
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
 