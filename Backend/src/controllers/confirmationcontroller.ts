import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
        permintaan: true,
        confirmationDetails: {
          include: { permintaanDetail: true },
        },
      },
    });
    res.status(200).json(confirmationOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const getConfirmationOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const confirmationOrder = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
      include: {
        confirmationDetails: {
          include: {
            permintaanDetail: {
              include: {
                permintaan: true,
                material: {
                  include: {
                    vendor: true,
                  },
                },
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
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const updateConfirmationOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nomorCO, tanggalCO, lokasiCO, status, confirmationDetails } = req.body;

    const updatedCO = await prisma.confirmationOrder.update({
      where: { id: Number(id) },
      data: {
        nomorCO,
        tanggalCO: new Date(tanggalCO),
        lokasiCO,
        status,
        confirmationDetails: {
          upsert: confirmationDetails.map((detail: any) => ({
            where: { id: detail.id ?? 0 },
            update: {
              qty: detail.qty,
              satuan: detail.satuan,
              keterangan: detail.keterangan,
            },
            create: {
              confirmationOrderId: Number(id),
              permintaanDetailId: detail.permintaanDetailId,
              qty: detail.qty,
              code: detail.code,
              satuan: detail.satuan,
              keterangan: detail.keterangan,
            },
          })),
        },
      },
      include: { confirmationDetails: true },
    });

    res.status(200).json(updatedCO);
  } catch (error) {
    console.error("Error updating Confirmation Order:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const deleteConfirmationOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.confirmationOrder.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Confirmation Order berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};