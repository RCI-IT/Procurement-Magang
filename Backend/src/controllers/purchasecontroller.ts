import { Request, Response } from 'express';
import { PrismaClient, POStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Membuat Purchase Order baru
 */
export const createPurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomorPO, tanggalPO, lokasiPO, keterangan, permintaanId } = req.body;

    const existingPermintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: permintaanId },
    });

    if (!existingPermintaan) {
      res.status(404).json({ error: "Permintaan lapangan tidak ditemukan" });
      return;
    }

    const newPO = await prisma.purchaseOrder.create({
      data: {
        nomorPO,
        tanggalPO: new Date(tanggalPO),
        lokasiPO,
        keterangan,
        permintaan: { connect: { id: permintaanId } },
      },
    });

    res.status(201).json({ message: "Purchase Order berhasil dibuat", newPO });
  } catch (error) {
    console.error("Gagal membuat Purchase Order:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat membuat Purchase Order" });
  }
};

/**
 * Mendapatkan semua Purchase Order
 */
export const getAllPurchaseOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: { permintaan: true },
    });

    res.status(200).json(purchaseOrders);
  } catch (error) {
    console.error("Gagal mengambil Purchase Order:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil Purchase Order" });
  }
};

/**
 * Mendapatkan Purchase Order berdasarkan ID
 */
export const getPurchaseOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "ID tidak valid" });
      return;
    }

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: parsedId },
      include: { permintaan: true },
    });

    if (!purchaseOrder) {
      res.status(404).json({ error: "Purchase Order tidak ditemukan" });
      return;
    }

    res.status(200).json(purchaseOrder);
  } catch (error) {
    console.error("Gagal mengambil Purchase Order:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil Purchase Order" });
  }
};

/**
 * Mengupdate status Purchase Order
 */
export const updatePurchaseOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "ID tidak valid" });
      return;
    }

    if (!Object.values(POStatus).includes(status)) {
      res.status(400).json({ error: "Status tidak valid" });
      return;
    }

    const updatedPO = await prisma.purchaseOrder.update({
      where: { id: parsedId },
      data: { status },
    });

    res.status(200).json({ message: "Status Purchase Order diperbarui", updatedPO });
  } catch (error) {
    console.error("Gagal memperbarui status PO:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memperbarui status Purchase Order" });
  }
};

/**
 * Menghapus Purchase Order
 */
export const deletePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "ID tidak valid" });
      return;
    }

    await prisma.purchaseOrder.delete({
      where: { id: parsedId },
    });

    res.status(200).json({ message: "Purchase Order berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus Purchase Order:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat menghapus Purchase Order" });
  }
};
