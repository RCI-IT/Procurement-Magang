import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import * as path from "path";
import fs from "fs";

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});
const upload = multer({ storage });
export const createMaterial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Received Data:", req.body);

    const { name, unit, code, description, price, categoryId, vendorId } = req.body;
    const parsedCategoryId = parseInt(categoryId, 10);
    const parsedPrice = parseFloat(price);
    const parsedVendorId = parseInt(vendorId, 10);

    if (
      isNaN(parsedCategoryId) ||
      isNaN(parsedPrice) ||
      isNaN(parsedVendorId)
    ) {
      res.status(400).json({ error: "Invalid categoryId, price, or vendorId" });
      return;
    }

    const image = req.file?.filename || "default-image.jpg";

    const newMaterial = await prisma.materials.create({
      data: {
        image,
        code,
        name,
        unit,
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
export const getAllMaterials = async (
  req: Request,
  res: Response
): Promise<void> => {
  const vendorId = req.query.vendorId;
  const categoryId = req.query.categoryId

  try {
    const materials = await prisma.materials.findMany({
      where: {
        ...(vendorId && { vendorId: Number(vendorId) }),
        ...(categoryId && { categoryId: Number(categoryId) }),
      },
      include: {
        vendor: true,
        category: true,
      },
    });

    if (materials.length === 0) {
      res.status(404).json({ error: "No materials found" });
      return;
    }

    res.status(200).json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

export const deleteMaterial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }

    const material = await prisma.materials.findUnique({
      where: { id: parsedId },
    });

    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    // Cek apakah material ini sedang digunakan di Confirmation Order
    const usedInConfirmation = await prisma.confirmationDetails.findMany({
      where: {
        materialId: parsedId,
      },
    });

    if (usedInConfirmation.length > 0) {
      res.status(400).json({
        error:
          "Material tidak bisa dihapus karena sedang digunakan dalam Confirmation Order.",
      });
      return;
    }

    // Hapus file jika ada gambar
    const fileName = String(material.image);
    const filePath = path.join(__dirname, "../../uploads", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Hapus data di database
    await prisma.materials.delete({ where: { id: parsedId } });

    res
      .status(200)
      .json({ message: "Material deleted successfully", filePath });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ error: "Failed to delete material" });
  }
};
export const editMaterial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    // const { name, description, price, categoryId, vendorId } = req.body;
    const parsedId = parseInt(id, 10);
    // const parsedCategoryId = parseInt(categoryId, 10);
    // const parsedPrice = parseFloat(price);
    // const parsedVendorId = parseInt(vendorId, 10);

    // if (
    //   isNaN(parsedId) ||
    //   isNaN(parsedCategoryId) ||
    //   isNaN(parsedPrice) ||
    //   isNaN(parsedVendorId)
    // ) {
    //   res
    //     .status(400)
    //     .json({ error: "Invalid ID, categoryId, price, or vendorId" });
    //   return;
    // }
    const material = await prisma.materials.findUnique({
      where: { id: parsedId },
    });

    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    const updateData: any = {};

    // Ambil data dari req.body jika ada
    if (req.body.code) updateData.code = req.body.code;
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.unit) updateData.unit = req.body.unit;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.price) updateData.price = parseFloat(req.body.price);
    if (req.body.categoryId)
      updateData.categoryId = parseInt(req.body.categoryId);
    if (req.body.vendorId) updateData.vendorId = parseInt(req.body.vendorId);

    // Tangani gambar jika ada file baru diunggah
    if (req.file) {
      if (material.image && material.image !== "default-image.jpg") {
        const oldImagePath = path.resolve("uploads", material.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }
    
    const updatedMaterial = await prisma.materials.update({
      where: { id: parsedId },
      data: updateData,
    });

    res.status(200).json(updatedMaterial);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Failed to update material" });
  }
};
export const getMaterialById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }

    const material = await prisma.materials.findUnique({
      where: { id: parsedId },
      include: { vendor: true, category: true },
    });

    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    const formattedResponse = {
      id: material.id,
      name: material.name,
      unit: material.unit,
      code: material.code,
      description: material.description,
      // price: `Rp ${material.price.toLocaleString("id-ID")}`,
      price: material.price,
      categoryId: material.categoryId,
      category: material.category ? material.category.name : "Unknown Category",
      vendorId: material.vendorId,
      vendor: material.vendor ? material.vendor.name : "Unknown Vendor",
      imageUrl: material.image,
      createdAt: new Date(material.createdAt).toLocaleString("id-ID"),
      updatedAt: new Date(material.updatedAt).toLocaleString("id-ID"),
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching material:", error);
    res.status(500).json({ error: "Failed to fetch material" });
  }
};
