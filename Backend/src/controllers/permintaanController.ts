import { Request, Response } from 'express';
import { PermintaanStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const approvePermintaan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Pastikan ID valid
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    // Pastikan permintaan ada di database
    const existingPermintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: parsedId },
    });

    if (!existingPermintaan) {
      res.status(404).json({ error: "Permintaan tidak ditemukan" });
      return;
    }

    // Update status menjadi APPROVED menggunakan ENUM
    const updatedPermintaan = await prisma.permintaanLapangan.update({
      where: { id: parsedId },
      data: { status: PermintaanStatus.APPROVED }, // ✅ Pakai ENUM, bukan string biasa
    });

    res.status(200).json({ message: "Permintaan telah disetujui", updatedPermintaan });
  } catch (error) {
    console.error("Gagal approve permintaan:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat menyetujui permintaan" });
  }
};

export const createPermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const { nomor, tanggal, lokasi, picLapangan, keterangan, detail } = req.body;

    const newPermintaan = await prisma.permintaanLapangan.create({
      data: {
        nomor,
        tanggal: new Date(tanggal),
        lokasi,
        picLapangan,
        keterangan,
        detail: {
          create: detail
        }
      },
    });

    res.status(201).json(newPermintaan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat permintaan lapangan' });
  }
};
export const getAllPermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const permintaanList = await prisma.permintaanLapangan.findMany({
      include: { detail: true },
    });

    res.status(200).json(permintaanList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data permintaan lapangan' });
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

    // Cari permintaan berdasarkan ID
    const permintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: parsedId },
      include: { detail: true },
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
export const editPermintaanLapangan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nomor, tanggal, lokasi, picLapangan, status, isConfirmed, isReceived, keterangan, detail } = req.body;

    // Pastikan permintaan ada di database
    const existingPermintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPermintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan" });
    }

    // Update permintaan utama
    const updatedPermintaan = await prisma.permintaanLapangan.update({
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
      for (const item of detail) {
        await prisma.permintaanDetails.upsert({
          where: { id: item.id || 0 }, // Jika ID ada, update, jika tidak, buat baru
          update: {
            materialId: item.materialId,
            qty: item.qty,
            satuan: item.satuan,
            mention: item.mention,
            code: item.code,
          },
          create: {
            permintaanId: updatedPermintaan.id,
            materialId: item.materialId,
            qty: item.qty,
            satuan: item.satuan,
            mention: item.mention,
            code: item.code,
          },
        });
      }
    }

    res.status(200).json({ message: "Permintaan berhasil diperbarui", updatedPermintaan });
  } catch (error) {
    console.error("Gagal memperbarui permintaan lapangan:", error);
    res.status(500).json({ error: "Gagal memperbarui permintaan lapangan" });
  }
};