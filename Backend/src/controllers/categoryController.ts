import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.categories.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
export const createCategory = async (req: Request, res: Response): Promise<void> => {
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
export const editCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await prisma.categories.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.categories.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }

    const category = await prisma.categories.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        name: true,
        materials: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            vendor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};