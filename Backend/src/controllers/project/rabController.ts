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
    } catch (error) {}
  },
  getAll: async (req: Request, res: Response) => {},
  getById: async (req: Request, res: Response) => {},
  put: async (req: Request, res: Response) => {},
  delete: async (req: Request, res: Response) => {},
};
