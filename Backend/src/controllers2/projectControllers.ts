import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//Handling error
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "../handle/error";

const prisma = new PrismaClient();

// export const createPermintaanLapangan = async (req: Request, res: Response) => {
//   try {
//     const {
//       nomor,
//       tanggal,
//       lokasi,
//       picLapangan,
//       keterangan,
//       detail,
//       projectId,
//     } = req.body;
//     if (
//       !nomor ||
//       !tanggal ||
//       !lokasi ||
//       !picLapangan ||
//       !Array.isArray(detail)
//     ) {
//       res.status(400).json({ error: "Harap isi semua field yang diperlukan" });
//       return;
//     }

//     const isDetailValid = detail.every(
//       (item: any) => item.materialName && item.qty && item.satuan
//     );

//     if (!isDetailValid) {
//       res.status(400).json({ error: "Detail material tidak valid" });
//       return;
//     }
//     const newPermintaan = await prisma.permintaanLapangan.create({
//       data: {
//         nomor,
//         tanggal: new Date(tanggal),
//         lokasi,
//         picLapangan,
//         keterangan,
//         projectId,
//         detail: {
//           create: detail.map((item: any) => ({
//             materialName: item.materialName,
//             qty: item.qty,
//             satuan: item.satuan,
//             mention: item.mention || null,
//             code: item.code || "",
//             keterangan: item.keterangan || null,
//           })),
//         },
//       },
//     });

//     res.status(201).json({
//       message: "Permintaan lapangan berhasil dibuat",
//       id: newPermintaan.id,
//       data: newPermintaan,
//     });
//   } catch (error: any) {
//     console.error("Error saat membuat permintaan lapangan:", error);

//     if (error.code === "P2002") {
//       res.status(400).json({ error: "Nomor permintaan sudah ada" });
//       return;
//     }

//     res.status(500).json({ error: "Gagal membuat permintaan lapangan" });
//   }
// };

export const projectController = {
  create: async (req: Request, res: Response) => {
    const value = req.body;

    // Validasi: pastikan value adalah object
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid or missing request body.",
        providedData: value,
      });
      return;
    }

    // Daftar field yang wajib diisi
    const requiredFields = [
      "name",
      "code",
      "location",
      "owner",
      "contractNo",
      "startDate",
      "endDate",
      "projectManager",
      "status",
    ];

    // Cek field yang tidak ada atau kosong
    const missingFields = requiredFields.filter((field) => {
      const val = value[field];
      val === undefined || val === null || val === "";
    });

    if (missingFields.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
        providedData: value,
      });
      return;
    }

    try {
      const existingProject = await prisma.project.findFirst({
        where: {
          code: value.code,
        },
      });

      if (existingProject) {
        res.status(StatusCodes.CONFLICT).json({
          message: `Project with code "${value.code}" already exists.`,
        });
        return;
      }

      const newProject = await prisma.project.create({
        data: {
          ...value,
          startDate: new Date(value.startDate), // Convert to Date
          endDate: new Date(value.endDate),
        },
      });

      res.status(StatusCodes.CREATED).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create project. Please try again.",
      });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await prisma.project.findMany();
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

      // 🧩 Ubah semua field yang namanya mengandung "Date" menjadi objek Date
      const formattedData = Object.entries(updatedData).reduce(
        (acc, [key, value]) => {
          if (
            typeof value === "string" &&
            key.toLowerCase().includes("date") &&
            /^\d{4}-\d{2}-\d{2}$/.test(value)
          ) {
            acc[key] = new Date(value);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      const updateData = await prisma.project.update({
        where: { id },
        data: formattedData,
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
      const data = await prisma.project.findUnique({
        where: { id: id },
      });
      const budget = await prisma.budgetItem.findMany({
        where: { projectId: id },
      });
      if (data && budget.length === 0) {
        await prisma.project.delete({
          where: { id: id },
        });
        res.status(200).json({ message: "Proyek berhasil dihapus." });
      } else if (budget.length > 0) {
        res.status(400).json({ message: "Ada budget dengan Proyek ini." });
      } else {
        res.status(500).json({ error: "Gagal menghapus proyek." });
      }
    } catch (error) {
      return handleBadRequestResponse(
        res,
        "An error occured while fetching data."
      );
    }
  },
};
