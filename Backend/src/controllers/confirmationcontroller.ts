import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE Confirmation Order
export const createConfirmationOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nomorCO, tanggalCO, lokasiCO, permintaanId, items, vendorId } =
      req.body;

    // ✅ 1. Validasi input
    if (
      !nomorCO ||
      !tanggalCO ||
      !lokasiCO ||
      !permintaanId ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({
        message: "Semua data diperlukan dan item tidak boleh kosong.",
      });
      return;
    }

    // ✅ 2. Cek Permintaan
    const existingPermintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: permintaanId },
    });
    if (!existingPermintaan) {
      res.status(400).json({ message: "Permintaan tidak ditemukan" });
      return;
    }

    // ✅ 3. Cek Vendor
    const vendor = await prisma.vendors.findUnique({
      where: { id: Number(vendorId) },
    });
    if (!vendor) {
      res.status(404).json({ error: "Vendor tidak ditemukan" });
      return;
    }

    // ✅ 4. Validasi Items
    const validatedItems = items.map((item: any) => {
      if (
        !item.materialId ||
        !item.qty ||
        !item.satuan ||
        !item.code ||
        !item.status ||
        !item.keterangan
      ) {
        throw new Error("Semua field item harus terisi!");
      }

      return {
        materialId: item.materialId,
        qty: item.qty,
        satuan: item.satuan,
        code: item.code,
        status: item.status,
        keterangan: item.keterangan,
      };
    });

    // ✅ 5. Buat Confirmation Order
    const confirmationOrder = await prisma.confirmationOrder.create({
      data: {
        nomorCO,
        tanggalCO: new Date(tanggalCO),
        lokasiCO,
        permintaan: {
          connect: { id: permintaanId },
        },
        vendor: {
          connect: { id: vendor.id }, // ✅ Penting: sambungkan vendor
        },
        confirmationDetails: {
          create: validatedItems,
        },
      },
      include: {
        permintaan: true,
        confirmationDetails: {
          include: {
            material: true,
          },
        },
      },
    });

    // ✅ 6. Response
    res.status(201).json({
      message: "Confirmation Order berhasil dibuat",
      confirmationOrder,
    });
  } catch (error) {
    console.error("Error createConfirmationOrder:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat Confirmation Order",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// GET All Confirmation Orders
export const getAllConfirmationOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const confirmationOrders = await prisma.confirmationOrder.findMany({
      include: {
        confirmationDetails: {
          include: {
            material: {
              include: {
                vendor: true,
              },
            },
          },
        },
        permintaan: true,
      },
    });

    res.status(200).json(confirmationOrders);
  } catch (error) {
    console.error("Error getAllConfirmationOrders:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data", error });
  }
};
// GET Confirmation Order by ID
export const getConfirmationOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const confirmationOrder = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
      include: {
        confirmationDetails: {
          include: {
            material: true,
          },
        },
        permintaan: true,
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
// UPDATE Confirmation Order
export const updateConfirmationOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { nomorCO, tanggalCO, lokasiCO, status, confirmationDetails } =
    req.body;

  try {
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

    // Siapkan data update secara dinamis
    const updateData: any = {};
    if (nomorCO !== undefined) updateData.nomorCO = nomorCO;
    if (tanggalCO !== undefined) updateData.tanggalCO = new Date(tanggalCO);
    if (lokasiCO !== undefined) updateData.lokasiCO = lokasiCO;
    if (status !== undefined) updateData.status = status.toUpperCase();

    // Update confirmationOrder jika ada data yang diubah
    if (Object.keys(updateData).length > 0) {
      await prisma.confirmationOrder.update({
        where: { id: Number(id) },
        data: updateData,
      });
    }

    // Optional: update detail jika dikirim
    if (Array.isArray(confirmationDetails)) {
      for (const detail of confirmationDetails) {
        const detailId = Number(detail.id) || 0;

        if (
          !detail.confirmationDetailId ||
          isNaN(Number(detail.confirmationDetailId))
        ) {
          continue;
        }

        await prisma.confirmationDetails.update({
          where: {
            id: detailId,
          },
          data: {
            qty: Number(detail.qty) || 0,
            satuan: detail.satuan || "",
          },
        });
      }
    }

    res.status(200).json({ message: "Confirmation Order berhasil diupdate" });
  } catch (error) {
    console.error("Error updating confirmation order:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengupdate confirmation order",
    });
  }
};

// DELETE Confirmation Order
export const deleteConfirmationOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: "ID tidak valid" });
      return;
    }

    const existing = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
      include: {
        confirmationDetails: {
          include: {
            material: {
              include: {
                vendor: true,
              },
            },
          },
        },
        permintaan: true,
      },
    });

    if (!existing) {
      res.status(404).json({ message: "Confirmation Order tidak ditemukan" });
      return;
    }

    // const hasApproved = existing.confirmationDetails.some(
    //   (detail) => detail.status === "ACC"
    // );

    // if (hasApproved) {
    //   res
    //     .status(400)
    //     .json({
    //       message:
    //         "Tidak dapat menghapus karena terdapat detail dengan status ACC",
    //     });
    //   return;
    // }

    // Cek ada PO terkait atau tidak
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { confirmationOrderId: Number(id) },
    });

    if (existingPO) {
      res.status(400).json({
        error:
          "Confirmation Order tidak bisa dihapus karena masih ada Purchase Order terkait.",
      });
      return;
    }

    // Hapus semua detail terlebih dahulu
    await prisma.confirmationDetails.deleteMany({
      where: { confirmationOrderId: Number(id) },
    });

    await prisma.confirmationOrder.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Confirmation Order berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting Confirmation Order:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus", error });
  }
};
// ACC Confirmation Details dan buat Purchase Order
export const accConfirmationDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { confirmationDetailIds } = req.body;

  if (
    !Array.isArray(confirmationDetailIds) ||
    confirmationDetailIds.length === 0 ||
    confirmationDetailIds.some((id) => typeof id !== "number")
  ) {
    res
      .status(400)
      .json({ error: "ConfirmationDetailIds harus berupa array angka" });
    return;
  }

  try {
    const details = await prisma.confirmationDetails.findMany({
      where: { id: { in: confirmationDetailIds } },
      include: {
        confirmationOrder: true,
        material: true,
      },
    });

    if (details.length === 0) {
      res.status(404).json({ error: "Confirmation details tidak ditemukan" });
      return;
    }

    const confirmationOrderId = details[0].confirmationOrderId;

    const isSameConfirmationOrder = details.every(
      (d: any) => d.confirmationOrderId === confirmationOrderId
    );
    if (!isSameConfirmationOrder) {
      res.status(400).json({
        error: "Semua item harus berasal dari Confirmation Order yang sama",
      });
      return;
    }

    await prisma.confirmationDetails.updateMany({
      where: { id: { in: confirmationDetailIds } },
      data: { status: "ACC" },
    });

    let existingPO = await prisma.purchaseOrder.findUnique({
      where: { confirmationOrderId },
    });

    if (!existingPO) {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      const datePrefix = `${year}/${month}/${day}`;

      const lastPO = await prisma.purchaseOrder.findFirst({
        where: {
          nomorPO: {
            startsWith: `PO-${datePrefix}`,
          },
        },
        orderBy: { id: "desc" },
      });

      let nextNumber = 1;
      if (lastPO) {
        const match = lastPO.nomorPO.match(/PO-\d{2}\/\d{2}\/\d{2}-(\d{3})$/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const nomorPO = `PO-${datePrefix}-${String(nextNumber).padStart(3, "0")}`;

      existingPO = await prisma.purchaseOrder.create({
        data: {
          nomorPO,
          tanggalPO: today,
          // lokasiPO: details[0].confirmationOrder.lokasiCO,
          confirmationOrderId,
        },
      });
    }

    const newPurchaseDetails = await Promise.all(
      details.map((detail: any) =>
        prisma.purchaseDetails.create({
          data: {
            purchaseOrderId: existingPO!.id,
            materialId: detail.material.id,
            qty: detail.qty,
            code: detail.code,
            satuan: detail.satuan,
            keterangan: detail.keterangan || "",
          },
        })
      )
    );

    res.status(200).json({
      message:
        "Confirmation Details berhasil ACC dan dipindahkan ke Purchase Order",
      purchaseOrder: existingPO,
      purchaseDetails: newPurchaseDetails,
    });
  } catch (err) {
    console.error("Error accConfirmationDetails:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
