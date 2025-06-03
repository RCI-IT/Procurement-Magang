import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PermintaanStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const createPermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const { nomor, tanggal, lokasi, picLapangan, keterangan, detail } =
      req.body;

    if (
      !nomor ||
      !tanggal ||
      !lokasi ||
      !picLapangan ||
      !Array.isArray(detail)
    ) {
      res.status(400).json({ error: "Harap isi semua field yang diperlukan" });
      return;
    }

    const isDetailValid = detail.every(
      (item: any) => item.materialName && item.qty && item.satuan
    );

    if (!isDetailValid) {
      res.status(400).json({ error: "Detail material tidak valid" });
      return;
    }
    const newPermintaan = await prisma.permintaanLapangan.create({
      data: {
        nomor,
        tanggal: new Date(tanggal),
        lokasi,
        picLapangan,
        keterangan,
        detail: {
          create: detail.map((item: any) => ({
            materialName: item.materialName,
            qty: item.qty,
            satuan: item.satuan,
            mention: item.mention || null,
            code: item.code || "",
            keterangan: item.keterangan || null,
          })),
        },
      },
    });

    res.status(201).json({
      message: "Permintaan lapangan berhasil dibuat",
      data: newPermintaan,
    });
  } catch (error: any) {
    console.error("Error saat membuat permintaan lapangan:", error);

    if (error.code === "P2002") {
      res.status(400).json({ error: "Nomor permintaan sudah ada" });
      return;
    }

    res.status(500).json({ error: "Gagal membuat permintaan lapangan" });
  }
};
export const getAllPermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const permintaanList = await prisma.permintaanLapangan.findMany({
      include: {
        user: true,
        detail: {
          // include: {
          //   material: {
          //     include: {
          //       vendor: true,
          //     },
          //   },
          // },
        },
      },
    });
    res.status(200).json(permintaanList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data permintaan lapangan" });
  }
};
export const getPermintaanById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    // Remove the inclusion of confirmationDetails
    const permintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: parsedId },
      include: {
        user: true,
        detail: true,
        // {
        //   include: {
        //     material: true, // No confirmationDetails here
        //   },
        // },
      },
    });

    if (!permintaan) {
      res.status(404).json({ error: "Permintaan tidak ditemukan" });
      return;
    }

    res.status(200).json(permintaan);
    return;
  } catch (error) {
    console.error("Error fetching permintaan by ID:", error);
    res.status(500).json({ error: "Gagal mengambil permintaan lapangan" });
  }
};
export const updateStatusPermintaan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPermintaan = await prisma.permintaanLapangan.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.status(200).json(updatedPermintaan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengupdate status permintaan" });
  }
};
export const updateStatusPermintaanDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "IN_PROGRESS",
      "CLOSED",
      "CANCELLED",
      "READ",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ error: "Status tidak valid" });
      return;
    }

    const existingDetail = await prisma.permintaanDetails.findUnique({
      where: { id: Number(id) },
    });

    if (!existingDetail) {
      res.status(404).json({ error: "Data permintaan detail tidak ditemukan" });
      return;
    }

    const updatedDetail = await prisma.permintaanDetails.update({
      where: { id: Number(id) },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    res.status(200).json(updatedDetail);
  } catch (error) {
    console.error("Gagal mengupdate status permintaan detail:", error);
    res
      .status(500)
      .json({ error: "Gagal mengupdate status permintaan detail" });
  }
};
export const deletePermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCO = await prisma.confirmationOrder.findMany({
      where: { permintaanId: Number(id) },
    });

    if (existingCO.length > 0) {
      res.status(400).json({
        error:
          "Permintaan Lapangan tidak bisa dihapus karena masih ada Confirmation Order terkait.",
      });
      return;
    }

    await prisma.permintaanDetails.deleteMany({
      where: { permintaanId: Number(id) },
    });
    await prisma.permintaanLapangan.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Permintaan lapangan berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menghapus permintaan lapangan" });
  }
};

export const editPermintaanLapangan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      nomor,
      tanggal,
      lokasi,
      picLapangan,
      status,
      isConfirmed,
      isReceived,
      keterangan,
      detail,
    } = req.body;

    const existingPermintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPermintaan) {
      res.status(404).json({ error: "Permintaan tidak ditemukan" });
      return;
    }

    await prisma.permintaanLapangan.update({
      where: { id: Number(id) },
      data: {
        nomor,
        tanggal: new Date(tanggal),
        lokasi,
        picLapangan,
        status,
        isConfirmed,
        isReceived,
        keterangan,
      },
    });

    if (Array.isArray(detail)) {
      await Promise.all(
        detail.map(async (item) => {
          if (item.id) {
            await prisma.permintaanDetails.update({
              where: { id: item.id },
              data: {
                materialName: item.materialName,
                qty: item.qty,
                satuan: item.satuan,
                mention: item.mention,
                code: item.code,
                keterangan: item.keterangan,
                status: item.status || "PENDING",
              },
            });
          } else {
            await prisma.permintaanDetails.create({
              data: {
                permintaanId: Number(id),
                materialName: item.materialName,
                qty: item.qty,
                satuan: item.satuan,
                mention: item.mention,
                code: item.code,
                keterangan: item.keterangan,
                status: item.status || "PENDING",
              },
            });
          }
        })
      );
    }

    res.status(200).json({ message: "Permintaan berhasil diperbarui" });
  } catch (error) {
    console.error("Gagal memperbarui permintaan lapangan:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memperbarui data" });
  }
};
