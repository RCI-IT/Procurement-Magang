import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

// Konfigurasi Multer untuk menangani upload gambar
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

// ✅ Fungsi untuk membuat material baru
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

// ✅ Fungsi untuk mendapatkan semua material
export const getAllMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const materials = await prisma.materials.findMany();

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
