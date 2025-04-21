import { Request, Response } from "express";
import { PrismaClient, PDetailStatus } from '@prisma/client';


const prisma = new PrismaClient();

// CREATE
export const createPurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomorPO, tanggalPO, lokasiPO, confirmationOrderId, userId, keterangan } = req.body;

    const confirmationOrder = await prisma.confirmationOrder.findUnique({
      where: { id: confirmationOrderId },
      include: {
        purchaseOrder: true,
        confirmationDetails: true,
      },
    });

    if (!confirmationOrder) {
      res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
      return;
    }

    if (confirmationOrder.purchaseOrder) {
      res.status(400).json({ message: "Purchase Order sudah dibuat untuk CO ini" });
      return;
    }

    const approvedDetails = confirmationOrder.confirmationDetails.filter(
      (detail) => detail.status === "ACC"
    );

    if (approvedDetails.length === 0) {
      res.status(400).json({ message: "Tidak ada detail yang disetujui (ACC)" });
      return;
    }

    const fetchDetails = await prisma.confirmationDetails.findMany({
      where: { id: { in: approvedDetails.map((d) => d.id) } },
      include: {
        permintaanDetail: true,
      },
    });

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        nomorPO,
        tanggalPO: new Date(tanggalPO),
        lokasiPO,
        keterangan,
        confirmationOrder: {
          connect: { id: confirmationOrderId },
        },
        user: userId ? { connect: { id: userId } } : undefined,
        purchaseDetails: {
          create: fetchDetails.map((detail) => ({
            materialId: detail.permintaanDetail.materialId,
            qty: detail.qty,
            code: detail.code,
            satuan: detail.satuan,
            keterangan: detail.keterangan || detail.permintaanDetail.keterangan || "",
          })),
        },
      },
    });

    res.status(201).json({
      message: "Purchase Order berhasil dibuat",
      data: purchaseOrder,
    });
  } catch (error) {
    console.error("Error createPurchaseOrder:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat membuat Purchase Order", error });
  }
};

// GET ALL
export const getAllPurchaseOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        confirmationOrder: true,
        purchaseDetails: {
          include: {
            material: {
              include: {
                vendor: true,
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getAllPurchaseOrders:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// GET BY ID
export const getPurchaseOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.purchaseOrder.findUnique({
      where: { id: Number(id) },
      include: {
        confirmationOrder: true,
        purchaseDetails: {
          include: {
            material: {
              include: {
                vendor: true,
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!order) {
      res.status(404).json({ message: "Purchase Order tidak ditemukan" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getPurchaseOrderById:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// UPDATE
export const updatePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nomorPO, tanggalPO, lokasiPO, status, keterangan, userId, purchaseDetails } = req.body;

  try {
    const updatedPO = await prisma.purchaseOrder.update({
      where: { id: Number(id) },
      data: {
        nomorPO,
        tanggalPO: new Date(tanggalPO),
        lokasiPO,
        status,
        keterangan,
        userId,
      },
    });

    if (Array.isArray(purchaseDetails)) {
      await prisma.purchaseDetails.deleteMany({
        where: { purchaseOrderId: updatedPO.id },
      });

      await prisma.purchaseDetails.createMany({
        data: purchaseDetails.map((detail: any) => ({
          purchaseOrderId: updatedPO.id,
          materialId: detail.materialId,
          qty: detail.qty,
          code: detail.code,
          satuan: detail.satuan,
          keterangan: detail.keterangan,
        })),
      });
    }

    res.json({ message: "Purchase Order updated successfully", data: updatedPO });
  } catch (error) {
    console.error("[UPDATE_PO_ERROR]", error);
    res.status(500).json({ message: "Failed to update Purchase Order" });
  }
};

// DELETE
export const deletePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.purchaseOrder.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Purchase Order berhasil dihapus" });
  } catch (error) {
    console.error("Error deletePurchaseOrder:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
