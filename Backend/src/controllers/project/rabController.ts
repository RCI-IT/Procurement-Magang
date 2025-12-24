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
    const dataRab = req.body;
    try {
      // 0️⃣ Validasi body wajib
      // if (!employeeId || !projectId || !roleId) {
      //   res.status(StatusCodes.BAD_REQUEST).json({
      //     message: "employeeId, projectId, and roleId are required",
      //   });
      //   return;
      // }

      // 1️⃣ Validasi project
      const project = await prisma.project.findUnique({
        where: { id: dataRab.projectId },
      });
      if (!project) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Project not found",
        });
        return;
      }
      // 2️⃣ Cek apakah member terdaftar dalam projek tersebut
      const member = await prisma.projectMember.findFirst({
        where: {
          id: dataRab.createdBy,
          projectId: dataRab.projectId,
        },
      });

      if (!member) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          message: "Creator is not a member of this project",
        });
        return;
      }

      // 4️⃣ Create Rab
      const rab = await prisma.rab.create({
        data: {
          projectId: dataRab.projectId,
          name: dataRab.name,
          description: dataRab.description,
          totalBudget: dataRab.totalBudget,
          createdBy: dataRab.createdBy ?? null,
        },
        include: {
          project: true,
          created: true,
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: "RAB created successfully",
        data: rab,
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
      const allRab = await prisma.rab.findMany();
      if (allRab.length > 0) {
        res.status(StatusCodes.OK).json(allRab);
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
  getById: async (req: Request, res: Response) => {
    const idRab = req.params.id;
    try {
      const data = await prisma.rab.findUnique({
        where: { id: idRab },
        include: { created: { include: { project: true } } },
      });
      if (data) {
        res.status(StatusCodes.OK).json(data);
      } else {
        return handleNotFoundResponse(res, "Not data was found.");
      }
    } catch (error) {
      return handleBadRequestResponse(
        res,
        "An error occured while fetching data."
      );
    }
  },
  delete: async (req: Request, res: Response) => {
    const idRab = req.params.id;
    try {
      const deleteData = await prisma.rab.delete({
        where: { id: idRab },
      });
      res
        .status(200)
        .json({ data: deleteData, message: "User berhasil dihapus." });
    } catch (error) {
      return handleBadRequestResponse(
        res,
        "An error occured while fetching data."
      );
    }
  },
  put: async (req: Request, res: Response) => {},
};
