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

export const projectController = {
  create: async (req: Request, res: Response) => {
    const data = req.body;
    try {
      const existProject = await prisma.project.findFirst({
        where: {
          OR: [{ projectName: data.projectName }, { code: data.code }],
        },
      });
      if (existProject) {
        res.status(StatusCodes.CONFLICT).json({
          message: `Project with code "${data.username}" already exists.`,
        });
        return;
      }
      const newProject = await prisma.project.create({ data });
      res.status(StatusCodes.OK).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const allProject = await prisma.project.findMany();
      if (allProject.length > 0) {
        res.status(StatusCodes.OK).json(allProject);
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
    const id = req.params.id;
    try {
      const data = await prisma.project.findUnique({
        where: { id: id },
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
    const id = req.params.id;
    try {
      const deleteData = await prisma.project.delete({
        where: { id: id },
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
  put: async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
      const data = await prisma.project.findUnique({ where: { id } });
      if (!data) {
        handleNotFoundResponse(res, `${id} does not exist.`);
        return;
      }
      if (
        !updatedData ||
        typeof updatedData !== "object" ||
        Array.isArray(updatedData)
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid or missing request body.",
          providedData: updatedData,
        });
        return;
      }
      const updateData = await prisma.project.update({
        where: { id },
        data: updatedData,
      });

      res.status(StatusCodes.OK).json(updateData);
    } catch (error: any) {
      if (error.code === "P1000" && error.message.includes("5432")) {
        return handleServerError(
          res,
          "Unable to connect to the database server. Please try again later."
        );
      }

      if (error.code === "P2025") {
        // Prisma specific error: Record to update not found
        return handleNotFoundResponse(res, `Project with ID ${id} not found.`);
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
};
