import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPurchaseOrders = (req: Request, res: Response): Promise<void> => {
  return prisma.purchaseOrder.findMany({
    include: {
      purchaseDetails: {
        include: {
          material: true,
        },
      },
      confirmationOrder: true,
    },
  })
    .then((purchases) => {
      res.json(purchases);
      return;
    })
    .catch((error) => {
      res.status(500).json({ message: "Gagal mengambil data Purchase Order", error });
      return;
    });
};
export const getPurchaseOrderById = (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  return prisma.purchaseOrder.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      purchaseDetails: {
        include: {
          material: true,
        },
      },
      confirmationOrder: true,
    },
  })
    .then((purchase) => {
      if (!purchase) {
        res.status(404).json({ message: "Purchase Order tidak ditemukan" });
        return;
      }
      res.json(purchase);
      return;
    })
    .catch((error) => {
      res.status(500).json({ message: "Gagal mengambil detail Purchase Order", error });
      return;
    });
};
export const deletePurchaseDetails = async (purchaseOrderId: number): Promise<void> => {
    try {
      await prisma.purchaseDetails.deleteMany({
        where: { purchaseOrderId: purchaseOrderId },
      });
    } catch (error) {
      throw new Error("Gagal menghapus Purchase Details");
    }
  };
  
export const deletePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await deletePurchaseDetails(parseInt(id, 10));
  
      const deletedPurchaseOrder = await prisma.purchaseOrder.delete({
        where: { id: parseInt(id, 10) },
      });
  
      if (deletedPurchaseOrder) {
        await prisma.confirmationOrder.update({
          where: { id: deletedPurchaseOrder.confirmationOrderId },
          data: { status: 'PENDING' },
        });
      }
  
      res.json({ message: "Purchase Order dan detailnya berhasil dihapus, status ConfirmationOrder diubah ke PENDING" });
    } catch (error) {
      res.status(500).json({ message: "Gagal menghapus Purchase Order atau detailnya, atau mengubah status ConfirmationOrder", error });
    }
  };
