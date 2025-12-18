import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//Handling error
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "@/handle/error";

const prisma = new PrismaClient();

export const roleController = {
  create: async (req: Request, res: Response) => {
    // 🔹 Normalisasi input
    const roleName = String(req.body.roleName).toUpperCase();
    try {
      const existRole = await prisma.authRole.findFirst({
        where: {
          roleName,
        },
      });
      if (existRole) {
        res.status(StatusCodes.CONFLICT).json({
          message: `Role is already exist.`,
        });
      }
      const newData = await prisma.authRole.create({
        data: { roleName },
      });
      res.status(StatusCodes.CREATED).json({ newData });
    } catch (error) {
      console.error("Error creating project:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await prisma.authRole.findMany();
      if (data.length > 0) {
        res.status(StatusCodes.OK).json(data);
        return;
      } else {
        return handleNotFoundResponse(res, "No data was found.");
      }
    } catch (error) {
      return handleServerError(
        res,
        "An error occured while fetching employees"
      );
    }
  },
  edit: async (req: Request, res: Response) => {
    const id = req.params.id;
    const roleName = String(req.body.roleName).toUpperCase();
    try {
      const updateData = await prisma.authRole.update({
        where: { id },
        data: {roleName: roleName},
      });
      res
        .status(StatusCodes.OK)
        .json({ message: `Update has succesful.`, updateData });
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
  delete: async (req: Request, res: Response) => {
    try {
      const data = await prisma.authRole.delete({
        where: { id: req.params.id },
      });

      res.status(200).json({ message: "Proyek berhasil dihapus.", data: data });
    } catch (error) {
      return handleBadRequestResponse(
        res,
        "An error occured while fetching data."
      );
    }
  },
};
