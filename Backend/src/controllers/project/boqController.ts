import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "@/handle/error";
import { parseDateOnly } from "@/utils/parseDate";

const prisma = new PrismaClient();

export const boqController = {
  create: async (req: Request, res: Response) => {
    try {
      const { rabId, materialId, description, quantity, price, type } =
        req.body;

      // 0️⃣ Validasi body wajib
      if (!rabId || !materialId || !description) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "employeeId, projectId, and roleId are required",
        });
        return;
      }

      // 1️⃣ Validasi RAB
      const rab = await prisma.rab.findUnique({
        where: { id: rabId },
      });
      if (!rab) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "RAB not found",
        });
        return;
      }

      // 2️⃣ Validasi boqType
      const boqType = await prisma.boqType.findUnique({
        where: { id: type },
      });
      if (!type) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "BOQ type not found",
        });
        return;
      }

      // 3️⃣ Cek duplikasi (sesuai @@unique)
      const existingBoq = await prisma.boq.findFirst({
        where: {
          AND: { rabId, materialId },
        },
      });

      if (existingBoq) {
        res.status(StatusCodes.CONFLICT).json({
          message: "Employee already has this role in the project",
        });
        return;
      }

      // 4️⃣ Create member
      const boq = await prisma.boq.create({
        data: {
          rabId,
          materialId,
          description,
          quantity,
          price,
          type,
        },
        include: {
          material: true,
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: "Project member created successfully",
        data: boq,
      });
      return;
    } catch (error: any) {
      // Handle unique constraint (double safety)
      if (error.code === "P2002") {
        res.status(StatusCodes.CONFLICT).json({
          message: "Employee already has this role in the project",
        });
        return;
      }

      console.error("Error creating member:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project member. Please try again.",
      });
      return;
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const allboq = await prisma.boq.findMany();
      if (allboq.length > 0) {
        res.status(StatusCodes.OK).json(allboq);
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
  getById: async (req: Request, res: Response) => {},
  put: async (req: Request, res: Response) => {},
  delete: async (req: Request, res: Response) => {},
};
