import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, categoryId, vendorId, description } = req.body;
    const image = req.file?.filename || 'default-image.jpg';

    if (!name || !price || !categoryId || !vendorId || !description) {
      res.status(400).json({ error: 'All fields including description are required' });
      return;
    }

    const newMaterial = await prisma.materials.create({
      data: {
        image,
        name,
        description,
        price: parseInt(price, 10),
        categoryId: parseInt(categoryId, 10),
        vendorId: parseInt(vendorId, 10),
      },
    });

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create material' });
  }
};

export const getAllMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const materials = await prisma.materials.findMany();
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};
