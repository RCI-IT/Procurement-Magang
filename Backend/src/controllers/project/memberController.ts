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
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Project not found",
        });

        
      }
    } catch (error) {
      console.error("Error creating member: ", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
};
