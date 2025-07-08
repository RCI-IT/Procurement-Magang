import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Get all Purchase Orders
export const getAllPurchaseOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchases = await prisma.purchaseOrder.findMany({
      include: {
        purchaseDetails: {
          include: {
            material: true,
          },
        },
        confirmationOrder: true,
      },
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data Purchase Order', error });
  }
};

// ✅ Get a specific Purchase Order by ID
export const getPurchaseOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const purchase = await prisma.purchaseOrder.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        purchaseDetails: {
          include: {
            material: true,
          },
        },
        confirmationOrder: {
          include: {
            vendor: true,
            permintaan: {
              select: {
                nomor: true, 
              },
            }
          }
        },
      },
    });

    if (!purchase) {
      res.status(404).json({ message: 'Purchase Order tidak ditemukan' });
      return;
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail Purchase Order', error });
  }
};

// ✅ Delete all Purchase Details associated with a Purchase Order
export const deletePurchaseDetails = async (purchaseOrderId: number): Promise<void> => {
  try {
    await prisma.purchaseDetails.deleteMany({
      where: { purchaseOrderId },
    });
  } catch (error) {
    throw new Error('Gagal menghapus Purchase Details');
  }
};

// ✅ Delete a Purchase Order and set related Confirmation Order status to PENDING
export const deletePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const parsedId = parseInt(id, 10);

    await deletePurchaseDetails(parsedId);

    const deletedPurchaseOrder = await prisma.purchaseOrder.delete({
      where: { id: parsedId },
    });

    if (deletedPurchaseOrder) {
      await prisma.confirmationOrder.update({
        where: { id: deletedPurchaseOrder.confirmationOrderId },
        data: { status: 'PENDING' },
      });
    }

    res.json({ message: 'Purchase Order dan detailnya berhasil dihapus, status ConfirmationOrder diubah ke PENDING' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus Purchase Order atau detailnya, atau mengubah status ConfirmationOrder', error });
  }
};

