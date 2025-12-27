import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleConflictResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "@/handle/error";

const prisma = new PrismaClient();

export const typeController = {
  create: async (req: Request, res: Response) => {
    if (!req.body.type || typeof req.body.type !== "string") {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "type is required",
      });
      return;
    }

    const type = req.body.type.trim().toUpperCase();

    try {
      const exist = await prisma.boqType.findFirst({
        where: { type },
      });
      if (exist) {
        return handleConflictResponse(res, "Role already exists");
      }
      const newData = await prisma.boqType.create({
        data: { type },
      });

      res.status(StatusCodes.CREATED).json(newData);
      return;
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
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await prisma.boqType.findMany();
      if (data.length > 0) {
        res.status(StatusCodes.OK).json(data);
        return;
      } else {
        return handleNotFoundResponse(res, "No data was found.");
      }
    } catch (error) {
      return handleServerError(res, "An error occured while fetching role");
    }
  },
  edit: async (req: Request, res: Response) => {
    const id = req.params.id;
    const type = String(req.body.type).toUpperCase();
    try {
      const exist = await prisma.boqType.findFirst({
        where: {type}
      })
      if(exist){
        return handleConflictResponse(res, "Role already exists")
      }
      const updateData = await prisma.boqType.update({
        where: { id },
        data: { type },
      });
      res
        .status(StatusCodes.OK)
        .json({ message: `Update has succesful.`, updateData });
      return;
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
      const data = await prisma.boqType.delete({
        where: { id: req.params.id },
      });

      res.status(200).json({ message: "Proyek berhasil dihapus.", data: data });
      return;
    } catch (error) {
      return handleBadRequestResponse(
        res,
        "An error occured while fetching data."
      );
    }
  },
};