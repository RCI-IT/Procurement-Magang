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
  price?: number;
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
  deletedCategories?: string[];
  deletedMaterials?: string[];
}

interface CategoryTree {
  kategori: string;
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

async function upsertCategoryTree(
  category: CategoryInput,
  projectId: string,
  parentId?: string | null
) {
  let currentCategory;

  if (category.id) {
    // cek dulu apakah category ada
    const exists = await prisma.budgetCategory.findUnique({
      where: { id: category.id },
    });

    if (exists) {
      currentCategory = await prisma.budgetCategory.update({
        where: { id: category.id },
        data: {
          name: category.name,
          parentId: parentId || null,
          projectId,
        },
      });
    } else {
      // fallback → create baru kalau id tidak valid
      currentCategory = await prisma.budgetCategory.create({
        data: {
          name: category.name,
          parentId: parentId || null,
          projectId,
        },
      });
    }
  } else {
    // create kategori baru
    currentCategory = await prisma.budgetCategory.create({
      data: {
        name: category.name,
        parentId: parentId || null,
        projectId,
      },
    });
  }

  // Upsert semua material (tanpa auto-delete)
  for (const material of category.materials || []) {
    if (material.id) {
      // cek apakah material ada
      const exists = await prisma.budgetItem.findUnique({
        where: { id: material.id },
      });

      if (exists) {
        await prisma.budgetItem.update({
          where: { id: material.id },
          data: {
            description: material.name,
            unit: material.unit ?? "Unit",
            quantity: material.qty,
            price: material.price ?? 0,
            frequency: material.frequency ?? null,
            duration: material.duration ?? null,
          },
        });
      }
    } else {
      await prisma.budgetItem.create({
        data: {
          description: material.name,
          unit: material.unit ?? "Unit",
          quantity: material.qty,
          price: material.price ?? 0,
          frequency: material.frequency ?? null,
          duration: material.duration ?? null,
          projectId,
          categoryId: currentCategory.id,
        },
      });
    }
  }

  // Rekursif untuk children
  for (const child of category.children || []) {
    await upsertCategoryTree(child, projectId, currentCategory.id);
  }

  // 🔥 Hapus kategori kosong (tidak ada item & tidak ada anak)
  const stillHasItems = await prisma.budgetItem.count({
    where: { categoryId: currentCategory.id },
  });
  const stillHasChildren = await prisma.budgetCategory.count({
    where: { parentId: currentCategory.id },
  });

  if (stillHasItems === 0 && stillHasChildren === 0) {
    await prisma.budgetCategory.delete({
      where: { id: currentCategory.id },
    });
    return null;
  }

  return currentCategory;
}

// helper rekursif untuk hapus kategori + anak + material
async function deleteCategoryTree(categoryId: string) {
  // cari semua anak kategori
  const children = await prisma.budgetCategory.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  });

  // hapus semua item di kategori ini
  await prisma.budgetItem.deleteMany({
    where: { categoryId },
  });

  // rekursif hapus anak
  for (const child of children) {
    await deleteCategoryTree(child.id);
  }

  // hapus kategori ini
  await prisma.budgetCategory.delete({
    where: { id: categoryId },
  });
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
        return;
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
            id: cat.id,
            kategori: cat.name,
            materials: cat.items.map((item) => ({
              id: item.id,
              name: item.description,
              qty: item.quantity ?? 0,
              unit: item.unit,
              frequency: item.frequency,
              duration: item.duration,
              harga: item.price ?? 0, // Optional: bisa isi jika ada field harga
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
          id: item.id,
          name: item.description,
          qty: item.quantity ?? 0,
          unit: item.unit,
          frequency: item.frequency,
          duration: item.duration,
          harga: item.price ?? 0,
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
  //     }

  //     // Simpan kategori & subkategori
  //     for (const category of categories) {
  //       await upsertCategoryTree(category, projectId);
  //     }

  //     // Handle "Uncategorized" khusus untuk project ini
  //     let uncategorizedCategory = await prisma.budgetCategory.findFirst({
  //       where: { name: "Uncategorized", projectId },
  //     });

  //     if (!uncategorizedCategory) {
  //       uncategorizedCategory = await prisma.budgetCategory.create({
  //         data: { name: "Uncategorized", projectId },
  //       });
  //     }

  //     for (const material of uncategorizedMaterials || []) {
  //       if (material.id) {
  //         await prisma.budgetItem.update({
  //           where: { id: material.id },
  //           data: {
  //             description: material.name,
  //             unit: material.unit ?? "Unit",
  //             quantity: material.qty,
  //             price: material.price ?? 0,
  //             frequency: material.frequency ?? null,
  //             duration: material.duration ?? null,
  //             projectId,
  //             categoryId: uncategorizedCategory.id,
  //           },
  //         });
  //       } else {
  //         await prisma.budgetItem.create({
  //           data: {
  //             description: material.name,
  //             unit: material.unit ?? "Unit",
  //             quantity: material.qty,
  //             price: material.price ?? 0,
  //             frequency: material.frequency ?? null,
  //             duration: material.duration ?? null,
  //             projectId,
  //             categoryId: uncategorizedCategory.id,
  //           },
  //         });
  //       }
  //     }

  //     res.json({ message: "Budget berhasil disimpan/diupdate" });
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //       .json({ message: "Failed to fetch data" });
  //   }
  // },

  update: async (req: Request, res: Response) => {
    const {
      projectId,
      categories,
      uncategorizedMaterials = [],
      deletedCategories = [],
      deletedMaterials = [],
    } = req.body as RequestPayload;

    try {
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!projectExists) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Project not found" });
        return;
      }

      // 1️⃣ Hapus kategori (rekursif)
      if (deletedCategories.length > 0) {
        for (const catId of deletedCategories) {
          await deleteCategoryTree(catId);
        }
      }

      // 2️⃣ Hapus material tertentu
      if (deletedMaterials.length > 0) {
        await prisma.budgetItem.deleteMany({
          where: { id: { in: deletedMaterials }, projectId },
        });
      }

      // 3️⃣ Upsert kategori + material (rekursif)
      for (const category of categories || []) {
        await upsertCategoryTree(category, projectId);
      }

      // 4️⃣ Handle uncategorized
      let uncategorizedCategory = await prisma.budgetCategory.findFirst({
        where: { name: "Uncategorized", parentId: null, projectId },
      });

      if (!uncategorizedCategory) {
        uncategorizedCategory = await prisma.budgetCategory.create({
          data: { name: "Uncategorized", parentId: null, projectId },
        });
      }

      for (const material of uncategorizedMaterials) {
        if (material.id) {
          await prisma.budgetItem.update({
            where: { id: material.id },
            data: {
              description: material.name,
              quantity: material.qty,
              price: material.price ?? 0,
              unit: material.unit ?? "Unit",
              frequency: material.frequency ?? null,
              duration: material.duration ?? null,
            },
          });
        } else {
          await prisma.budgetItem.create({
            data: {
              description: material.name,
              quantity: material.qty,
              price: material.price ?? 0,
              unit: material.unit ?? "Unit",
              frequency: material.frequency ?? null,
              duration: material.duration ?? null,
              projectId,
              categoryId: uncategorizedCategory.id,
            },
          });
        }
      }

      res.json({ message: "Budget updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to update budget" });
    }
  },
};
