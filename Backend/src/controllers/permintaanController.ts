import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PermintaanStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const createPermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const { nomor, tanggal, lokasi, picLapangan, keterangan, detail } = req.body;

    // ✅ Validasi input agar tidak ada data yang kosong atau tidak sesuai
    if (!nomor || !tanggal || !lokasi || !picLapangan || !Array.isArray(detail)) {
      res.status(400).json({ error: "Harap isi semua field yang diperlukan" });
      return;
    }

    // ✅ Pastikan `detail` berisi array dengan objek yang memiliki properti yang benar
    const isDetailValid = detail.every((item: any) =>
      item.materialId && item.qty && item.satuan
    );

    if (!isDetailValid) {
      res.status(400).json({ error: "Detail material tidak valid" });
      return;
    }

    // ✅ Membuat permintaan lapangan baru
    const newPermintaan = await prisma.permintaanLapangan.create({
      data: {
        nomor,
        tanggal: new Date(tanggal), // Pastikan format tanggal benar
        lokasi,
        picLapangan,
        keterangan,
        detail: {
          create: detail.map((item: any) => ({
            materialId: item.materialId,
            qty: item.qty,
            satuan: item.satuan,
            mention: item.mention || null, // Bisa null jika tidak diisi
            code: item.code || "", // Default string kosong jika tidak ada
            keterangan: item.keterangan || null,
          })),
        },
      },
    });

    res.status(201).json({
      message: "Permintaan lapangan berhasil dibuat",
      data: newPermintaan,
    });
  } catch (error: any) {
    console.error("Error saat membuat permintaan lapangan:", error);

    // ✅ Tangani error Prisma (misalnya duplikasi nomor)
    if (error.code === "P2002") {
      res.status(400).json({ error: "Nomor permintaan sudah ada" });
      return;
    }

    res.status(500).json({ error: "Gagal membuat permintaan lapangan" });
  }
};
export const getAllPermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const permintaanList = await prisma.permintaanLapangan.findMany({
      include: {
        user: true, // ⬅️ Tambahkan ini untuk menampilkan info user pembuat
        detail: {
          include: {
            material: {
              include: {
                vendor: true,
              },
            },
            confirmationDetails: true, // ⬅️ Cek apakah sudah masuk PO
          },
        },
      },
    });

    // Filter PL yang masih punya barang belum masuk PO
    const filteredPermintaanList = permintaanList
      .map((pl: any) => ({
        ...pl,
        detail: pl.detail.filter((item: any) => item.poDetails.length === 0),
      }))
      .filter((pl: any) => pl.detail.length > 0);

    res.status(200).json(filteredPermintaanList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data permintaan lapangan" });
  }
};
export const getPermintaanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Pastikan ID valid
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    // Cari permintaan berdasarkan ID, termasuk user
    const permintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: parsedId },
      include: {
        user: true,
        detail: {
          include: {
            material: true,
            confirmationDetails: true,
          },
        },
      },
    });

    if (!permintaan) {
      res.status(404).json({ error: "Permintaan tidak ditemukan" });
      return;
    }

    res.status(200).json(permintaan);
  } catch (error) {
    console.error("Error fetching permintaan by ID:", error);
    res.status(500).json({ error: "Gagal mengambil permintaan lapangan" });
  }
};
export const updateStatusPermintaan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPermintaan = await prisma.permintaanLapangan.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.status(200).json(updatedPermintaan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengupdate status permintaan' });
  }
};
export const deletePermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.permintaanLapangan.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Permintaan lapangan berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus permintaan lapangan' });
  }
};
export const editPermintaanLapangan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nomor, tanggal, lokasi, picLapangan, status, isConfirmed, isReceived, keterangan, detail } = req.body;

    // Pastikan permintaan ada di database
    const existingPermintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPermintaan) {
      res.status(404).json({ error: "Permintaan tidak ditemukan" });
      return;
    }

    // Update permintaan utama
    await prisma.permintaanLapangan.update({
      where: { id: Number(id) },
      data: {
        nomor,
        tanggal: new Date(tanggal),
        lokasi,
        picLapangan,
        status,
        isConfirmed,
        isReceived,
        keterangan,
      },
    });

    // Jika ada detail baru, update juga
    if (detail && Array.isArray(detail)) {
      await Promise.all(
        detail.map((item) =>
          prisma.permintaanDetails.upsert({
            where: { id: item.id || 0 }, // Jika ID ada, update, jika tidak, buat baru
            update: {
              materialId: item.materialId,
              qty: item.qty,
              satuan: item.satuan,
              mention: item.mention,
              code: item.code,
            },
            create: {
              permintaanId: Number(id),
              materialId: item.materialId,
              qty: item.qty,
              satuan: item.satuan,
              mention: item.mention,
              code: item.code,
            },
          })
        )
      );
    }

    res.status(200).json({ message: "Permintaan berhasil diperbarui" });
  } catch (error) {
    console.error("Gagal memperbarui permintaan lapangan:", error);
    res.status(500).json({ error: "Gagal memperbarui permintaan lapangan" });
  }
};