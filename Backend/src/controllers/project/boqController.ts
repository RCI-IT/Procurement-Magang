import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "@/handle/error";

const prisma = new PrismaClient();

export const rabController = {
  create: async (req: Request, res: Response) => {
    try {
      const { employeeId, projectId, roleId, joinedAt } = req.body;

      // 0️⃣ Validasi body wajib
      if (!employeeId || !projectId || !roleId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "employeeId, projectId, and roleId are required",
        });
        return;
      }

      // 1️⃣ Validasi project
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Project not found",
        });
        return;
      }

      // 2️⃣ Validasi role
      const role = await prisma.projectRole.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Project role not found",
        });
        return;
      }

      // 3️⃣ Cek duplikasi (sesuai @@unique)
      const existingMember = await prisma.projectMember.findFirst({
        where: {
          employeeId,
          projectId,
          roleId,
        },
      });

      if (existingMember) {
        res.status(StatusCodes.CONFLICT).json({
          message: "Employee already has this role in the project",
        });
        return;
      }

      // 4️⃣ Create member
      const member = await prisma.projectMember.create({
        data: {
          employeeId,
          projectId,
          roleId,
          joinedAt: joinedAt ? parseDateOnly(joinedAt) : undefined,
        },
        include: {
          role: true,
          project: true,
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: "Project member created successfully",
        data: member,
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
  getAll: async (req: Request, res: Response) => {},
  getById: async (req: Request, res: Response) => {},
  put: async (req: Request, res: Response) => {},
  delete: async (req: Request, res: Response) => {},
};
