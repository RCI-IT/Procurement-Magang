import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import * as err from "../handle/error";

const prisma = new PrismaClient();

interface MaterialInput {
  id?: string; // kalau update ada id, kalau create tidak ada
  name: string;
  qty: number;
  unit?: string;
  harga?: number;
  duration?: number | null;
  frequency?: number;
}

interface CategoryInput {
  id?: string; // kalau update ada id
  name: string;
  materials: MaterialInput[];
  children: CategoryInput[];
}

interface RequestPayload {
  categories: CategoryInput[];
  uncategorizedMaterials: MaterialInput[];
  projectId: string;
}

interface CategoryTree {
  name: string;
  materials: {
    name: string;
    qty: number;
    harga: number;
  }[];
  children: CategoryTree[];
}

/**
 * Fungsi rekursif untuk menyimpan kategori & subkategori
 */
async function saveCategoryTree(
  category: CategoryInput,
  projectId: string,
  parentId?: string | null
) {
  // Simpan kategori
  let currentCategory;

  // 🔍 Cek apakah kategori dengan nama sama sudah ada di level ini
  let existingCategory = await prisma.budgetCategory.findFirst({
    where: {
      name: category.name,
      parentId: parentId || null,
      projectId,
    },
  });
  if (existingCategory) {
    // update (kalau ada field lain, misal rename)
    currentCategory = await prisma.budgetCategory.update({
      where: { id: existingCategory.id },
      data: {
        name: category.name,
      },
    });
  } else {
    currentCategory = await prisma.budgetCategory.create({
      data: {
        name: category.name,
        parentId: parentId || null,
        projectId,
      },
    });
  }
  // Simpan semua material dalam kategori ini
  for (const material of category.materials || []) {
    const existingMaterial = await prisma.budgetItem.findFirst({
      where: {
        projectId,
        categoryId: currentCategory.id,
        description: material.name,
      },
    });

    if (!existingMaterial) {
      await prisma.budgetItem.create({
        data: {
          projectId,
          categoryId: currentCategory.id,
          description: material.name,
          unit: "Unit", // default, bisa diubah
          quantity: material.qty,
          frequency: null, // opsional
          duration: null, // opsional
        },
      });
    }
  }

  // Rekursif untuk subkategori
  for (const child of category.children || []) {
    await saveCategoryTree(child, projectId, currentCategory.id);
  }
}

export const budgetController = {
  create: async (req: Request, res: Response) => {
    const { projectId, categories, uncategorizedMaterials } = req.body;

    try {
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!projectExists) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Project not found" });
      }

      // Simpan kategori & subkategori
      for (const category of categories) {
        await saveCategoryTree(category, projectId);
      }

      // Simpan material tanpa kategori
      for (const material of uncategorizedMaterials || []) {
        // Bikin kategori default "Uncategorized" sekali saja
        let uncategorizedCategory = await prisma.budgetCategory.findFirst({
          where: { name: "Uncategorized", parentId: null },
        });

        if (!uncategorizedCategory) {
          uncategorizedCategory = await prisma.budgetCategory.create({
            data: { name: "Uncategorized", parentId: null },
          });
        }

        for (const material of uncategorizedMaterials) {
          const existingItem = await prisma.budgetItem.findFirst({
            where: {
              projectId,
              categoryId: uncategorizedCategory.id,
              description: material.name,
            },
          });

          if (!existingItem) {
            await prisma.budgetItem.create({
              data: {
                projectId,
                categoryId: uncategorizedCategory.id,
                description: material.name,
                unit: "Unit",
                quantity: material.qty,
                frequency: null,
                duration: null,
              },
            });
          }
        }
      }

      res.json({ message: "Data berhasil disimpan" });
    } catch (error) {
      throw error;
    }
  },
  getByProject: async (req: Request, res: Response) => {
    const { projectId } = req.params;

    try {
      // Cek apakah project ada
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!projectExists) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Project not found" }); // ⬅️ pakai return di sini
      }

      // Ambil semua kategori + item berdasarkan projectId
      const categories = await prisma.budgetCategory.findMany({
        where: { projectId },
        include: {
          items: {
            where: { projectId },
          },
        },
      });

      // Fungsi rekursif untuk membangun tree
      function buildCategoryTree(parentId: string | null): CategoryTree[] {
        return categories
          .filter(
            (cat) => cat.parentId === parentId && cat.name !== "Uncategorized"
          )
          .map((cat) => ({
            name: cat.name,
            materials: cat.items.map((item) => ({
              name: item.description,
              qty: item.quantity ?? 0,
              harga: 0, // Optional: bisa isi jika ada field harga
            })),
            children: buildCategoryTree(cat.id),
          }));
      }

      // Ambil kategori "Uncategorized" (jika ada)
      const uncategorizedCategory = categories.find(
        (cat) => cat.name === "Uncategorized" && cat.parentId === null
      );

      const uncategorizedMaterials =
        uncategorizedCategory?.items.map((item) => ({
          name: item.description,
          qty: item.quantity ?? 0,
          harga: 0,
        })) || [];

      // Kirim response
      res.json({
        projectId,
        categories: buildCategoryTree(null),
        uncategorizedMaterials,
      });
    } catch (error) {
      console.error("Error fetching project budget:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to fetch data" });
    }
  },

  // putByProject: async (req: Request, res: Response) => {
  //   const { projectId } = req.params;
  //   const { categories, uncategorizedMaterials } = req.body;
  //   try {
  //     const projectExists = await prisma.project.findUnique({
  //       where: { id: projectId },
  //     });
  //     if (!projectExists) {
  //       res
  //         .status(StatusCodes.BAD_REQUEST)
  //         .json({ message: "Project not found" });
  //       return;
  //     }

  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //       .json({ message: "Failed to fetch data" });
  //   }
  // },
};
