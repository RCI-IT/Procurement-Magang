import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  }
});
const upload = multer({ storage });
export const createMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Received Data:", req.body);

    const { name, description, price, categoryId, vendorId } = req.body;

    // Konversi data ke angka
    const parsedCategoryId = parseInt(categoryId, 10);
    const parsedPrice = parseFloat(price);
    const parsedVendorId = parseInt(vendorId, 10);

    if (isNaN(parsedCategoryId) || isNaN(parsedPrice) || isNaN(parsedVendorId)) {
      res.status(400).json({ error: "Invalid categoryId, price, or vendorId" });
      return;
    }

    const image = req.file?.filename || "default-image.jpg";

    const newMaterial = await prisma.materials.create({
      data: {
        image,
        name,
        description,
        price: parsedPrice,
        categoryId: parsedCategoryId,
        vendorId: parsedVendorId,
      },
    });

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Error in createMaterial:", error);
    res.status(500).json({ error: "Failed to create material" });
  }
};
export const getAllMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const materials = await prisma.materials.findMany({
      include: {
        vendor: true,
        category: true,
      },
    });

    if (materials.length === 0) {
      res.status(404).json({ error: 'No materials found' });
      return;
    }

    res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};

export const deleteMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }

    const material = await prisma.materials.findUnique({ where: { id: parsedId } });

    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    await prisma.materials.delete({ where: { id: parsedId } });

    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ error: "Failed to delete material" });
  }
};
export const editMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, vendorId } = req.body;

    // Konversi data ke tipe yang sesuai
    const parsedId = parseInt(id, 10);
    const parsedCategoryId = parseInt(categoryId, 10);
    const parsedPrice = parseFloat(price);
    const parsedVendorId = parseInt(vendorId, 10);

    if (isNaN(parsedId) || isNaN(parsedCategoryId) || isNaN(parsedPrice) || isNaN(parsedVendorId)) {
      res.status(400).json({ error: "Invalid ID, categoryId, price, or vendorId" });
      return;
    }

    // Cek apakah material dengan ID tersebut ada di database
    const material = await prisma.materials.findUnique({ where: { id: parsedId } });

    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    // Jika ada file gambar baru, hapus gambar lama dan simpan yang baru
    let newImage = material.image;
    if (req.file) {
      if (material.image && material.image !== "default-image.jpg") {
        fs.unlinkSync(`uploads/${material.image}`); // Hapus gambar lama
      }
      newImage = req.file.filename;
    }

    // Update material di database
    const updatedMaterial = await prisma.materials.update({
      where: { id: parsedId },
      data: {
        name,
        description,
        price: parsedPrice,
        categoryId: parsedCategoryId,
        vendorId: parsedVendorId,
        image: newImage,
      },
    });

    res.status(200).json(updatedMaterial);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Failed to update material" });
  }
};
export const getMaterialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }

    const material = await prisma.materials.findUnique({
      where: { id: parsedId },
      include: { vendor: true, category: true }, // Tambahkan relasi vendor & kategori
    });

    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    // Format ulang response agar lebih rapi
    const formattedResponse = {
      id: material.id,
      name: material.name,
      description: material.description,
      price: `Rp ${material.price.toLocaleString("id-ID")}`,
      category: material.category ? material.category.name : "Unknown Category",
      vendor: material.vendor ? material.vendor.name : "Unknown Vendor",
      imageUrl: `http://192.168.110.205:5000/uploads/${material.image}`,
      createdAt: new Date(material.createdAt).toLocaleString("id-ID"),
      updatedAt: new Date(material.updatedAt).toLocaleString("id-ID"),
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching material:", error);
    res.status(500).json({ error: "Failed to fetch material" });
  }
};

