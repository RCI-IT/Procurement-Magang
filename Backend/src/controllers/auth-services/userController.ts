import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "@/handle/error";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const userController = {
  // Create User dapat diganti dengan registrasi juga
  create: async (req: Request, res: Response) => {
    const data = req.body;
    // Validasi: pastikan data adalah object
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid or missing request body.",
        providedData: data,
      });
      return;
    }

    try {
      const existUser = await prisma.authUser.findFirst({
        where: {
          OR: [{ username: data.username }, { email: data.email }],
        },
      });
      if (existUser) {
        res.status(StatusCodes.CONFLICT).json({
          message: `Project with code "${data.username}" already exists.`,
        });
        return;
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await prisma.authUser.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      res.status(StatusCodes.CREATED).json(newUser);
      return;
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await prisma.authUser.findMany();
      if (data.length > 0) {
        res.status(StatusCodes.OK).json(data);
      } else {
        handleNotFoundResponse(res, "No data was found.");
      }
    } catch (error) {
      handleServerError(res, "An error occured while fetching data.");
    }
  },
  getById: async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const data = await prisma.authUser.findUnique({
        where: { id: id },
        include: {
          roles: { include: { role: true } },
        },
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

      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      const updateData = await prisma.authUser.update({
        where: { id },
        data: { ...updatedData, password: hashedPassword },
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
  delete: async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const deleteData = await prisma.authUser.delete({
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
};
