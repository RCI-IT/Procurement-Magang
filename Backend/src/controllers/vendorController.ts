import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

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
    res.status(500).json({ error: "Failed to create vendor" });
  }
};
export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendors.findMany({
      include: {
        materials: true, // Ini akan menyertakan semua material yang terkait dengan setiap vendor
      },
    });

    res.status(200).json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};
export const editVendor = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    res
      .status(200)
      .json({ message: "Vendor berhasil diperbarui", updatedVendor });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Gagal memperbarui vendor" });
  }
};
export const deleteVendor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const vendorId = Number(id);

    const existingVendor = await prisma.vendors.findUnique({
      where: { id: Number(id) },
      include: {
        materials: true,
      },
    });
    

    // 1. Ambil semua material milik vendor
    const vendorMaterials = await prisma.materials.findMany({
      where: { vendorId },
    });

    if (vendorMaterials.length > 0) {
      res.status(400).json({
        error: "Vendor tidak dapat dihapus. Hapus terlebih dahulu material.",
      });
      return;
    }

    // 2. Hapus file gambar (jika ada) dan material dari DB
    for (const material of vendorMaterials) {
      if (material.image) {
        const filePath = path.join(__dirname, "../../uploads", material.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await prisma.materials.delete({ where: { id: material.id } });
    }

    // 3. Hapus vendor
    await prisma.vendors.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Vendor berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ error: "Gagal menghapus vendor" });
  }
};
export const getVendorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Fetch vendor with related materials (join)
    const vendor = await prisma.vendors.findUnique({
      where: { id: Number(id) },
      include: {
        materials: true, // Include related materials using the vendorId
        
      },
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
