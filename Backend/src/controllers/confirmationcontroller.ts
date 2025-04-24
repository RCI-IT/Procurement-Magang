import { Request, Response } from "express";
import { PrismaClient,DetailStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const createConfirmationOrder = async (req: Request, res: Response) => {
  try {
    const { nomorCO, tanggalCO, lokasiCO, permintaanId, items } = req.body;

    const permintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: permintaanId },
      include: { detail: true },
    });

    if (!permintaan) {
      return res.status(404).json({ message: "Permintaan Lapangan tidak ditemukan" });
    }

    if (permintaan.detail.length === 0) {
      return res.status(400).json({ message: "Permintaan Lapangan tidak memiliki barang" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Tidak ada item yang dipilih" });
    }

    const confirmationOrder = await prisma.confirmationOrder.create({
      data: {
        nomorCO,
        tanggalCO,
        lokasiCO,
        permintaan: {
          connect: { id: permintaanId },
        },
        confirmationDetails: {
          create: items.map((item) => ({
            permintaanDetailId: item.permintaanDetailId,
            qty: item.qty,
            satuan: item.satuan,
            code: item.kodeBarang,
            status: item.status,
            keterangan: item.namaBarang,
          })),
        },
      },
    });

    res.status(201).json(confirmationOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const getAllConfirmationOrders = async (req: Request, res: Response) => {
  try {
    const confirmationOrders = await prisma.confirmationOrder.findMany({
      include: {
        confirmationDetails: {
          include: {
            permintaanDetail: {
              include: {
                material: {
                  include: {
                    vendor: true,
                  },
                },
                permintaan: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(confirmationOrders);
  } catch (error) {
    console.error("Error getAllConfirmationOrders:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const getConfirmationOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const confirmationOrder = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
      include:{
        confirmationDetails: {
          include: {
            permintaanDetail: {
              include: {
                material: {
                  include: {
                    vendor: true,
                  },
                },
                permintaan: true,
              },
            },
          },
        },
      },
    });

    if (!confirmationOrder) {
      return res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
    }

    res.status(200).json(confirmationOrder);
  } catch (error) {
    console.error("Error getConfirmationOrderById:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const updateConfirmationOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nomorCO, tanggalCO, lokasiCO, status, confirmationDetails } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    if (!nomorCO || !tanggalCO || !lokasiCO || !status || !Array.isArray(confirmationDetails)) {
      return res.status(400).json({ message: "Data tidak lengkap atau format salah" });
    }

    const existing = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
    }

    await prisma.confirmationOrder.update({
      where: { id: Number(id) },
      data: {
        nomorCO,
        tanggalCO: new Date(tanggalCO),
        lokasiCO,
        status: status.toUpperCase(),
      },
    });

    await prisma.confirmationDetails.deleteMany({
      where: { confirmationOrderId: Number(id) },
    });

    if (confirmationDetails.length > 0) {
      await prisma.confirmationDetails.createMany({
        data: confirmationDetails.map((detail: any) => ({
          confirmationOrderId: Number(id),
          permintaanDetailId: detail.permintaanDetailId,
          qty: detail.qty,
          code: detail.code,
          satuan: detail.satuan,
          keterangan: detail.keterangan || "",
        })),
      });
    }

    res.status(200).json({ message: "Confirmation Order berhasil diupdate" });
  } catch (error) {
    console.error("Error updating confirmation order:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengupdate confirmation order" });
  }
};
export const deleteConfirmationOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const existing = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
    }

    await prisma.confirmationOrder.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Confirmation Order berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting Confirmation Order:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus", error });
  }
};