import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const imageController = {
  addImages: async (req: Request, res: Response) => {
    const { materialId } = req.params;

    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ message: "No images uploaded" });
      return;
    }

    const data = req.files.map((file: any) => ({
      materialId,
      filename: file.filename,
    }));

    await prisma.materialImage.createMany({ data });

    res.status(201).json({ message: "Images added" });
  },
  replaceImage: async (req: Request, res: Response) => {
    const { imageId } = req.params;

    if (!req.file) {
      res.status(400).json({ message: "Image required" });
      return;
    }

    const image = await prisma.materialImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    // hapus file lama
    await fs.unlink(path.join("uploads", image.filename)).catch(() => {});

    // update db
    await prisma.materialImage.update({
      where: { id: imageId },
      data: { filename: req.file.filename },
    });

    res.json({ message: "Image replaced" });
  },
  deleteImage: async (req: Request, res: Response) => {
    const { imageId } = req.params;

    const image = await prisma.materialImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    await fs.unlink(path.join("uploads", image.filename)).catch(() => {});

    await prisma.materialImage.delete({ where: { id: imageId } });

    res.json({ message: "Image deleted" });
  },
};
