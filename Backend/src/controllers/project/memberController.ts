import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "@/handle/error";
import { parseDateOnly } from "@/utils/parseDate";

const prisma = new PrismaClient();

export const memberController = {
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
  getAll: async (req: Request, res: Response) => {
    try {
      const allMember = await prisma.projectMember.findMany();
      if (allMember.length > 0) {
        res.status(StatusCodes.OK).json(allMember);
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
    const idMemberRole = req.params.id;
    try {
      const data = await prisma.projectMember.findUnique({
        where: { id: idMemberRole },
        include: {
          role: true,
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
  delete: async (req: Request, res: Response) => {
    const idMemberRole = req.params.id;
    try {
      const deleteData = await prisma.projectMember.delete({
        where: { id: idMemberRole },
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
      // 1️⃣ Cek ProjectMember
      const member = await prisma.projectMember.findUnique({
        where: { id },
      });

      if (!member) {
        return handleNotFoundResponse(res, `${id} does not exist.`);
      }

      // 2️⃣ Validasi body
      if (
        !updatedData ||
        typeof updatedData !== "object" ||
        Array.isArray(updatedData)
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid or missing request body.",
        });
        return;
      }

      const payload: any = {};

      // 3️⃣ Validasi projectId (jika diupdate)
      if (updatedData.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: updatedData.projectId },
        });

        if (!project) {
          return handleNotFoundResponse(
            res,
            `Project ${updatedData.projectId} not found.`
          );
        }

        payload.projectId = updatedData.projectId;
      }

      // 4️⃣ Validasi roleId (jika diupdate)
      if (updatedData.roleId) {
        const role = await prisma.projectRole.findUnique({
          where: { id: updatedData.roleId },
        });

        if (!role) {
          return handleNotFoundResponse(
            res,
            `Role ${updatedData.roleId} not found.`
          );
        }

        payload.roleId = updatedData.roleId;
      }

      // 5️⃣ Validasi employeeId (jika diupdate)
      if (updatedData.employeeId) {
        payload.employeeId = String(updatedData.employeeId);
      }

      // 6️⃣ Parse joinedAt (UTC-safe)
      if (updatedData.joinedAt) {
        payload.joinedAt = parseDateOnly(updatedData.joinedAt);
      }

      // 7️⃣ Update ProjectMember
      const result = await prisma.projectMember.update({
        where: { id },
        data: payload,
      });

      res.status(StatusCodes.OK).json(result);
      return;
    } catch (error: any) {
      if (error.code === "P1000") {
        return handleServerError(
          res,
          "Unable to connect to the database server."
        );
      }

      if (error.code === "P2025") {
        return handleNotFoundResponse(
          res,
          `ProjectMember with ID ${id} not found.`
        );
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
