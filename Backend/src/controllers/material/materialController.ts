import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "@/handle/error";

const prisma = new PrismaClient();

export const materialController = {
  create: async (req: Request, res: Response) => {
    const { name, description, unit, code, categoryId } = req.body;
    try {
      const category = await prisma.categories.findUnique({
        where: categoryId,
      });
      if (!category) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Category is not found",
        });
        return;
      }
      const material = await prisma.material.create({
        data: {
          name,
          unit,
          code,
          description,
          categoryId,
        },
      });

      // 🔥 simpan banyak foto
      if (req.files && Array.isArray(req.files)) {
        const images = req.files.map((file: any) => ({
          materialId: material.id,
          filename: file.filename,
        }));

        await prisma.materialImage.createMany({
          data: images,
        });
      }

      res.status(201).json(material);
    } catch (error: any) {
      // ✅ Duplicate key error
      if (error.code === "P2002") {
        res.status(StatusCodes.CONFLICT).json({
          message: "Role already exists",
        });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create role",
      });
      return;
    }
  },
  edit: async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const material = await prisma.material.findUnique({ where: { id } });
      if (!material) {
        res.status(404).json({ message: "Material not found" });
        return;
      }

      await prisma.material.update({
        where: { id },
        data: req.body,
      });

      // 🔥 tambah foto baru (tidak hapus lama)
      if (req.files && Array.isArray(req.files)) {
        await prisma.materialImage.createMany({
          data: req.files.map((file: any) => ({
            materialId: id,
            filename: file.filename,
          })),
        });
      }

      res.json({ message: "Material updated" });
    } catch (error: any) {
      if (error.code === "P1000") {
        return handleServerError(
          res,
          "Unable to connect to the database server."
        );
      }

      if (error.code === "P2025") {
        return handleNotFoundResponse(
          res,
          `ProjectMember with ID ${id} not found.`
        );
      }

      if (error.name === "PrismaClientValidationError") {
        return handleUnprocessableEntityResponse(res, "Invalid data format.");
      }

      return handleBadRequestResponse(
        res,
        "An error occurred while processing the request."
      );
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const allMaterial = await prisma.material.findMany();
      if (allMaterial.length > 0) {
        res.status(StatusCodes.OK).json(allMaterial);
      } else {
        handleNotFoundResponse(res, "No data was found.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
  getAllByCategory: async (req: Request, res: Response) => {
    const getQueryString = (v: unknown): string | undefined =>
      typeof v === "string" ? v : undefined;
    const categoryId = getQueryString(req.query.categoryId);

    try {
      const materials = await prisma.material.findMany({
        where: {
          ...(categoryId && { categoryId }),
        },
        include: {
          category: true,
          materialVendors: {
            include: { vendor: true },
          },
        },
      });

      return res.json(materials);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Fetch materials failed" });
    }
  },
  getById: async (req: Request, res: Response) => {
    const materialId = req.params.id;
    try {
      const material = await prisma.material.findUnique({
        where: { id: materialId },
        include: {
          image: true,
        },
      });

      if (!material) {
        res.status(404).json({ message: "Material not found" });
        return;
      }

      res.json(material);
    } catch (error) {
      return handleBadRequestResponse(
        res,
        "An error occured while fetching data."
      );
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const material = await prisma.material.findUnique({
        where: { id: req.params.id },
        include: { image: true },
      });

      if (!material) {
        res.status(404).json({ message: "Material not found" });
        return;
      }

      for (const img of material.image) {
        await fs.unlink(path.join("uploads", img.filename)).catch(() => {});
      }

      await prisma.material.delete({ where: { id: req.params.id } });

      res.json({ message: "Material & images deleted" });
    } catch (error) {
      return handleBadRequestResponse(
        res,
        "An error occured while fetching data."
      );
    }
  },
};
