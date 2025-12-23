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

export const memberController = {
  create: async (req: Request, res: Response) => {
    const employee = req.body;
    try {
      // 1️⃣ Validasi project
      const project = await prisma.project.findUnique({
        where: { id: employee.projectId },
      });
      if (!project) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Project not found",
        });
      }
      // 2️⃣ Validasi Role
      const role = await prisma.projectRole.findUnique({
        where: { id: employee.roleId },
      });

      if (!role) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Project role not found",
        });
      }
      // 3️⃣ Cek duplikasi member (sesuai @@unique)
      const existingMember = await prisma.projectMember.findFirst({
        where: {
          employeeId: employee.employeeId,
          projectId: employee.projectId,
          roleId: employee.roleId,
        },
      });

      if (existingMember) {
         res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          message: "Employee already has this role in the project",
        });
      }

      // 4️⃣ Create member
      const member = await prisma.projectMember.create({
        data: employee,
        include: {
          role: true,
          project: true,
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: "Project member created successfully",
        data: member,
      });
    } catch (error) {
      console.error("Error creating member: ", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
};
