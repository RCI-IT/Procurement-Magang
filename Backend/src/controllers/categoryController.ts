import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.categories.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};
export const editCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await prisma.categories.update({
      where: { id: Number(id) }, // Konversi ID ke Number
      data: { name },
    });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.categories.delete({
      where: { id: Number(id) }, // Konversi ID ke Number
    });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};