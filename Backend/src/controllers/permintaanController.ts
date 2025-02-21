import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Membuat permintaan lapangan baru
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

// Mengambil semua permintaan lapangan
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

// Mengambil permintaan lapangan berdasarkan ID
export const getPermintaanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permintaan = await prisma.permintaanLapangan.findUnique({
      where: { id: Number(id) },
      include: { detail: true },
    });

    if (!permintaan) {
      return res.status(404).json({ error: 'Permintaan tidak ditemukan' });
    }

    res.status(200).json(permintaan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil permintaan lapangan' });
  }
};

// Mengupdate status permintaan lapangan
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

// Menghapus permintaan lapangan
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
