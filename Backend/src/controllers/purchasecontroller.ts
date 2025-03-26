import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { nomorPO, tanggalPO, lokasiPO, permintaanId } = req.body;

    // Cek apakah Permintaan Lapangan ada
    const permintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: permintaanId },
      include: { detail: true }, // Ambil semua barang dari PL
    });

    if (!permintaan) {
      return res.status(404).json({ message: "Permintaan Lapangan tidak ditemukan" });
    }

    if (permintaan.detail.length === 0) {
      return res.status(400).json({ message: "Permintaan Lapangan tidak memiliki barang" });
    }
    const { items } = req.body; // Ambil hanya items yang dipilih di frontend

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Tidak ada item yang dipilih" });
    }
    
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        nomorPO,
        tanggalPO,
        lokasiPO,
        permintaan: {
          connect: { id: permintaanId },
        },
        poDetails: {
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
    

    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const getAllPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        permintaan: true,
        poDetails: {
          include: { permintaanDetail: true },
        },
      },
    });
    res.status(200).json(purchaseOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: Number(id) },
      include: {
        poDetails: {
          include: {
            permintaanDetail: {
              include: {
                permintaan: true, // Tambahkan ini untuk mendapatkan Nomor PL
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

    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase Order tidak ditemukan" });
    }

    res.status(200).json(purchaseOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const updatePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nomorPO, tanggalPO, lokasiPO, status, poDetails } = req.body;

    // Update PO utama
    const updatedPO = await prisma.purchaseOrder.update({
      where: { id: Number(id) },
      data: {
        nomorPO,
        tanggalPO: new Date(tanggalPO),
        lokasiPO,
        status,
        poDetails: {
          // Loop update tiap PO Details
          upsert: poDetails.map((detail: any) => ({
            where: { id: detail.id ?? 0 }, // Jika id ada, update. Jika tidak, tambahkan.
            update: {
              qty: detail.qty,
              satuan: detail.satuan,
              keterangan: detail.keterangan,
            },
            create: {
              purchaseOrderId: Number(id),
              permintaanDetailId: detail.permintaanDetailId,
              qty: detail.qty,
              code: detail.code,
              satuan: detail.satuan,
              keterangan: detail.keterangan,
            },
          })),
        },
      },
      include: { poDetails: true }, // Return PO Details setelah update
    });

    res.status(200).json(updatedPO);
  } catch (error) {
    console.error("Error updating PO:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const deletePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.purchaseOrder.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Purchase Order berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
