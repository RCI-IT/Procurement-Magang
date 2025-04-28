import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createConfirmationOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomorCO, tanggalCO, lokasiCO, permintaanId, items } = req.body;

    const permintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: permintaanId },
      include: { detail: true },
    });

    if (!permintaan) {
      res.status(404).json({ message: "Permintaan Lapangan tidak ditemukan" });
      return;
    }

    if (permintaan.detail.length === 0) {
      res.status(400).json({ message: "Permintaan Lapangan tidak memiliki barang" });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Tidak ada item yang dipilih" });
      return;
    }

    // Simpan Confirmation Order
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

    // 2. Update status PermintaanDetails menjadi IN_PROGRESS
    await prisma.permintaanDetails.updateMany({
      where: {
        id: {
          in: items.map((item) => item.permintaanDetailId),
        },
      },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    res.status(201).json({ message: "Confirmation Order berhasil dibuat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const getAllConfirmationOrders = async (req: Request, res: Response): Promise<void> => {
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
export const getConfirmationOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const confirmationOrder = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
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

    if (!confirmationOrder) {
      res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
      return;
    }

    res.status(200).json(confirmationOrder);
  } catch (error) {
    console.error("Error getConfirmationOrderById:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
export const updateConfirmationOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nomorCO, tanggalCO, lokasiCO, status, confirmationDetails } = req.body;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: "ID tidak valid" });
      return;
    }

    if (!nomorCO || !tanggalCO || !lokasiCO || !status || !Array.isArray(confirmationDetails)) {
      res.status(400).json({ message: "Data tidak lengkap atau format salah" });
      return;
    }

    const existing = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
      return;
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
export const deleteConfirmationOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: "ID tidak valid" });
      return;
    }

    const existing = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
      return;
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
export const accConfirmationDetails = async (req: Request, res: Response): Promise<void> => {
  const { confirmationDetailIds } = req.body;

  if (!Array.isArray(confirmationDetailIds) || confirmationDetailIds.length === 0) {
    res.status(400).json({ error: 'No confirmationDetailIds provided' });
    return;
  }

  try {
    const details = await prisma.confirmationDetails.findMany({
      where: { id: { in: confirmationDetailIds } },
      include: {
        confirmationOrder: true,
        permintaanDetail: {
          include: { material: true },
        },
      },
    });

    if (details.length === 0) {
      res.status(404).json({ error: 'No confirmation details found' });
      return;
    }

    const confirmationOrderId = details[0].confirmationOrderId;

    await prisma.confirmationDetails.updateMany({
      where: { id: { in: confirmationDetailIds } },
      data: { status: 'ACC' },
    });

    let existingPO = await prisma.purchaseOrder.findUnique({
      where: { confirmationOrderId },
    });

    if (!existingPO) {
      const lastPO = await prisma.purchaseOrder.findFirst({
        orderBy: { id: 'desc' },
      });

      const nextNumber = lastPO ? lastPO.id + 1 : 1;
      const nomorPO = `PO-${String(nextNumber).padStart(3, '0')}`;

      existingPO = await prisma.purchaseOrder.create({
        data: {
          nomorPO,
          tanggalPO: new Date(),
          lokasiPO: details[0].confirmationOrder.lokasiCO,
          confirmationOrderId,
        },
      });
    }

    const newPurchaseDetails = await Promise.all(
      details.map(detail =>
        prisma.purchaseDetails.create({
          data: {
            purchaseOrderId: existingPO!.id,
            materialId: detail.permintaanDetail.material.id,
            qty: detail.qty,
            code: detail.code,
            satuan: detail.satuan,
            keterangan: detail.keterangan || '',
          },
        })
      )
    );

    res.status(200).json({
      message: 'Confirmation details ACC-ed and purchase details created',
      PO: existingPO,
      purchaseDetails: newPurchaseDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};