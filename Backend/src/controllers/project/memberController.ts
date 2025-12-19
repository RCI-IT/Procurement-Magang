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
      const memberCount = await prisma.projectMember.count();
      if (memberCount === 0) {
        console.log(
          "⚠️ Tidak ada role member, membuat role project default..."
        );
        const projectRole = await prisma.projectRole.upsert({
          where: { roleName: "WORKER" },
          update: {},
          create: { roleName: "WORKER" },
        });
      }
      // Member tersebut sudah ada dalam project dan punya role
      const existMember = await prisma.projectMember.findFirst({
        where: {
          employeeId: employee.employeeId,
          projectId: employee.projectId,
        },
      });
      if (existMember) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Member already exists in this project",
        });
      }
      const newEmployee = await prisma.projectMember.create({
        data: {
            ...employee,
            roleId: {employee.roleId}
        },
      });
      res.status(StatusCodes.CREATED).json(newEmployee);
    } catch (error) {
      console.error("Error creating member: ", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
};
