import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createVendor = async (req: Request, res: Response) => {
  const { name, address, city, phone } = req.body;
  try {
    const newVendor = await prisma.vendors.create({
      data: { name, address, city, phone },
    });
    res.status(201).json(newVendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
};
export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendors.findMany();
    res.status(200).json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};
export const editVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, city, phone } = req.body;

    const existingVendor = await prisma.vendors.findUnique({
      where: { id: Number(id) },
    });

    if (!existingVendor) {
      res.status(404).json({ error: "Vendor tidak ditemukan" });
      return;
    }

    const updatedVendor = await prisma.vendors.update({
      where: { id: Number(id) },
      data: { name, address, city, phone },
    });

    res.status(200).json({ message: "Vendor berhasil diperbarui", updatedVendor });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Gagal memperbarui vendor" });
  }
}
export const deleteVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingVendor = await prisma.vendors.findUnique({
      where: { id: Number(id) },
    });

    if (!existingVendor) {
      res.status(404).json({ error: "Vendor tidak ditemukan" });
      return;
    }

    await prisma.vendors.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Vendor berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ error: "Gagal menghapus vendor" });
  }
};
export const getVendorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendors.findUnique({
      where: { id: Number(id) },
    });

    if (!vendor) {
      res.status(404).json({ error: "Vendor tidak ditemukan" });
      return;
    }

    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: "Gagal mengambil data vendor" });
  }
};
