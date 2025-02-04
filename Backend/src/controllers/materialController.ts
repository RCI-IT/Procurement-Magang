import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

// Konfigurasi Multer untuk menangani file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder penyimpanan gambar
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname); // Membuat nama file unik
    cb(null, filename);
  }
});

const upload = multer({ storage });

export const createMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Received Data:", req.body); // Debugging untuk melihat data yang diterima

    const { name, description, price, category, vendorId } = req.body;

    // Pastikan category dikonversi ke tipe Integer (jika diperlukan)
    const categoryId = parseInt(category, 10); // Pastikan mengonversi category menjadi angka
    const priceValue = parseInt(price, 10); // Pastikan mengonversi price menjadi angka

    if (isNaN(priceValue)) {
      res.status(400).json({ error: 'Invalid category or price' });
      return;
    }

    const image = req.file?.filename || "default-image.jpg"; // Gunakan default jika tidak ada gambar

    // Menyimpan material baru ke database menggunakan Prisma
    const newMaterial = await prisma.materials.create({
      data: {
        image,
        name,
        description,
        price: priceValue,
        categoryId,  // Gunakan categoryId yang sudah dikonversi
        vendorId, // Gunakan vendorId
      },
    });

    res.status(201).json(newMaterial); // Kirimkan material baru dalam response
  } catch (error) {
    console.error("Error in createMaterial:", error);
    res.status(500).json({ error: 'Failed to create material' });
  }
};

// Rute untuk mengambil semua material
export const getAllMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query ke database untuk mengambil semua material
    const materials = await prisma.materials.findMany();

    if (materials.length === 0) {
      res.status(404).json({ error: 'No materials found' });
      return;
    }

    // Kirimkan hasil dalam format JSON
    res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};
