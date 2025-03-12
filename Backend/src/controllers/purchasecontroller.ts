import { Request, Response } from 'express';
import { PrismaClient, POStatus, Vendors } from '@prisma/client';

const prisma = new PrismaClient();

export const createPurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomorPO, tanggalPO, lokasiPO, keterangan, permintaanId } = req.body;

    // **1. Validasi Input**
    if (!nomorPO || !tanggalPO || !lokasiPO || !permintaanId) {
      res.status(400).json({ error: "Semua field wajib diisi" });
      return;
    }

    // **2. Validasi Format Tanggal**
    const parsedTanggal = new Date(tanggalPO);
    if (isNaN(parsedTanggal.getTime())) {
      res.status(400).json({ error: "Format tanggal tidak valid" });
      return;
    }

    // **3. Periksa apakah Permintaan Lapangan ada**
    const existingPermintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: Number(permintaanId) },
    });

    if (!existingPermintaan) {
      res.status(404).json({ error: "Permintaan lapangan tidak ditemukan" });
      return;
    }

    // **4. Buat Purchase Order**
    const newPO = await prisma.purchaseOrder.create({
      data: {
        nomorPO,
        tanggalPO: parsedTanggal,
        lokasiPO,
        keterangan,
        permintaan: { connect: { id: Number(permintaanId) } },
      },
    });

    res.status(201).json({ message: "Purchase Order berhasil dibuat", newPO });
  } catch (error) {
    console.error("Gagal membuat Purchase Order:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat membuat Purchase Order" });
  }
};
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
export const getPurchaseOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "ID tidak valid" });
      return;
    }

    // 1️⃣ Ambil Purchase Order
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: parsedId },
      include: {
        permintaan: {
          include: {
            detail: {
              include: {
                material: {
                  include: {
                    vendor: true, // ✅ Ambil data vendor dari material
                  },
                },
              },
            },
          },
        },
      },
    });
    

    if (!purchaseOrder) {
      res.status(404).json({ error: "Purchase Order tidak ditemukan" });
      return;
    }

    // 2️⃣ Ambil Semua Vendor Berdasarkan vendorId dari Material
    const vendorIds = purchaseOrder.permintaan?.detail
      ?.map((detail) => detail.material.vendorId)
      ?.filter((id, index, self) => id && self.indexOf(id) === index) ?? [];

    const vendors = await prisma.vendors.findMany({
      where: {
        id: { in: vendorIds },
      },
    });

    // 3️⃣ Gabungkan Data Vendor ke dalam Material
    const vendorMap = vendors.reduce<Record<number, Vendors>>((acc, vendor) => {
      acc[vendor.id] = vendor;
      return acc;
    }, {});

    const updatedPurchaseOrder = {
      ...purchaseOrder,
      permintaan: {
        ...purchaseOrder.permintaan,
        detail: purchaseOrder.permintaan?.detail?.map((detail) => ({
          ...detail,
          material: {
            ...detail.material,
            vendor: vendorMap[detail.material.vendorId] || null,
          },
        })) ?? [],
      },
    };

    // 4️⃣ Kirim Data ke Frontend
    res.status(200).json(updatedPurchaseOrder);
  } catch (error) {
    console.error("Gagal mengambil Purchase Order:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil Purchase Order" });
  }
};
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
