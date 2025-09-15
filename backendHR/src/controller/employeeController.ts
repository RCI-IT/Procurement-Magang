import { Request, Response } from "express"; 
import prisma from "../config/prisma";
import EmployeeValidation from "../validations/EmployeeValidation";
// import unlinkAsync from "../config/deleteImageCloudinary";
import {
  cleanupUploadedFiles,
  getFilesToDelete,
  getUploadedFilePaths,
} from "../utils/UploadImageEmployees";

//Handling error
import { StatusCodes } from "http-status-codes";
import {
  handleBadRequestResponse,
  handleNotFoundResponse,
  handleServerError,
  handleUnprocessableEntityResponse,
} from "../handle/error";

const EmployeeController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const employees = await prisma.employees.findMany();
      if (employees.length > 0) {
        return res.status(StatusCodes.OK).json(employees);
      } else {
        return handleNotFoundResponse(res, "No employees found.");
      }
    } catch (error) {
      console.error(error);
      return handleServerError(
        res,
        "An error occurred while fetching employees."
      );
    }
  },
  getById: async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    try {
      if (!employeeId) {
        return handleBadRequestResponse(res, "Invalid id employee");
      }
      const employee = await prisma.employees.findUnique({
        where: {
          id: employeeId,
        },
        include: {
          document: true,
        },
      });
      if (employee) {
        return res.status(StatusCodes.OK).json(employee);
      } else {
        return handleNotFoundResponse(
          res,
          `Employee id ${employeeId} not found`
        );
      }
    } catch (err: any) {
      if (err.code === "P1000" && err.message.includes("5432")) {
        return handleServerError(
          res,
          "Unable to connect to the database server. Please try again later."
        );
      }
      return handleServerError(
        res,
        "Internal Server Error. Please try again later."
      );
    }
  },
  createEmployee: async (req: Request, res: Response) => {
    try {
      // Simpan daftar file yang berhasil diupload
      const uploadedFiles = getUploadedFilePaths(req);

      const { error, value } = EmployeeValidation.validate(req.body);
      const getFilenameOrDefault = (
        file?: Express.Multer.File
      ): string | null => {
        return file ? file.filename : null;
      };

      const { image, idCard, taxCard, familyCard, diploma } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      if (error) {
        cleanupUploadedFiles(uploadedFiles);
        return handleUnprocessableEntityResponse(res, error.details[0].message);
      }

      const { status, leaveDate, resignDate } = req.body;

      if (status === "ACTIVE" && (leaveDate || resignDate)) {
        return res.status(400).json({
          error:
            "leaveDate dan resignDate hanya boleh diisi jika status bukan ACTIVE",
        });
      }

      if (status === "ONLEAVE" && !leaveDate) {
        return handleUnprocessableEntityResponse(
          res,
          "leaveDate tidak boleh null"
        );
      }

      if (status === "RESIGN" && !resignDate) {
        return handleUnprocessableEntityResponse(
          res,
          "resignDate tidak boleh null"
        );
      }

      const existingEmployee = await prisma.employees.findUnique({
        where: {
          employeeNumber: value.employeeNumber,
        },
        include: {
          document: true,
        },
      });

      if (existingEmployee) {
        return handleUnprocessableEntityResponse(
          res,
          "Employee with this number already exists"
        );
      } else {
        // Check for existing employee with same number and potentially uploaded image
        const existingEmployeeWithImage = await prisma.employees.findFirst({
          where: {
            employeeNumber: value.employeeNumber,
          },
        });

        if (existingEmployeeWithImage) {
          return handleUnprocessableEntityResponse(
            res,
            "Employee with this number already exists"
          );
        }

        let newEmployee;
        try {
          // Attempt to create employee data, including document creation
          newEmployee = await prisma.employees.create({
            data: {
              image: getFilenameOrDefault(image?.[0]),
              // status,
              // leaveDate: status !== status.ONLEAVE ? null : leaveDate,
              // resignDate: status !== status.RESIGN ? null : resignDate,
              ...value,
              document: {
                create: {
                  idCard: getFilenameOrDefault(idCard?.[0]) ?? null,
                  taxCard: getFilenameOrDefault(taxCard?.[0]) ?? null,
                  familyCard: getFilenameOrDefault(familyCard?.[0]) ?? null,
                  diploma: getFilenameOrDefault(diploma?.[0]) ?? null,
                },
              },
            },
            include: {
              document: true,
            },
          });
        } catch (err) {
          // If employee creation fails, remove uploaded files (if any)
          // const uploadedFiles = [image, idCard, taxCard, familyCard, diploma];
          // for (const file of uploadedFiles) {
          //   if (file?.[0]) {
          //     // Implement logic to remove the uploaded file based on storage provider
          //     console.error(
          //       "Failed to remove uploaded file:",
          //       file?.[0].filename
          //     );
          //   }
          // }
          // throw err; // Re-throw the error to be handled in the catch block below

          cleanupUploadedFiles(uploadedFiles);
          throw err;
        }

        if (!newEmployee) {
          return handleUnprocessableEntityResponse(
            res,
            "Failed to add new employee data"
          );
        }
        res.status(StatusCodes.CREATED).json(newEmployee);
      }
    } catch (err: any) {
      console.error("Error in createEmployee:", err);

      if (err.code === "P1000" && err.message.includes("5432")) {
        return handleServerError(
          res,
          "Unable to connect to the database server. Please try again later."
        );
      }

      return handleServerError(res, "Error creating. Please try again later.");
    }
  },
  putEmployee: async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    try {
      // Ambil daftar file yang diunggah
      // const uploadedFiles = getUploadedFilePaths(req);

      const { error, value }: any = EmployeeValidation.validate(req.body);

      if (!error) {
        // Fungsi untuk mendapatkan nama file dari request (jika ada)
        const getFilenameOrDefault = (
          file?: Express.Multer.File
        ): string | null => {
          return file ? file.filename : null;
        };

        // Ambil file dari request (jika ada)
        const { image, idCard, taxCard, familyCard, diploma } = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        // Ambil data karyawan yang sudah ada
        const existingEmployee = await prisma.employees.findUnique({
          where: {
            id: employeeId,
          },
          include: {
            document: true,
          },
        });
        if (!existingEmployee) {
          return handleUnprocessableEntityResponse(
            res,
            `${existingEmployee} does not exist`
          );
        }

        // Update data dalam database
        const updatedEmployee = await prisma.employees.update({
          where: {
            id: employeeId,
          },
          data: {
            image: getFilenameOrDefault(image?.[0]) ?? existingEmployee.image,
            ...value,
            document: {
              update: {
                idCard: idCard?.[0]
                  ? getFilenameOrDefault(idCard[0])
                  : existingEmployee.document?.idCard,
                taxCard: taxCard?.[0]
                  ? getFilenameOrDefault(taxCard[0])
                  : existingEmployee.document?.taxCard,
                familyCard: familyCard?.[0]
                  ? getFilenameOrDefault(familyCard[0])
                  : existingEmployee.document?.familyCard,
                diploma: diploma?.[0]
                  ? getFilenameOrDefault(diploma[0])
                  : existingEmployee.document?.diploma,
              },
            },
          },
          include: {
            document: true,
          },
        });

        // Menyimpan file lama yang akan dihapus (hanya jika ada file baru)
        const filesToDelete = [];

        // Cek dan tandai file lama yang akan dihapus
        if (image?.[0] && existingEmployee.image)
          filesToDelete.push({
            fieldname: "image",
            filename: existingEmployee.image,
          });
        if (idCard?.[0] && existingEmployee.document?.idCard)
          filesToDelete.push({
            fieldname: "idCard",
            filename: existingEmployee.document.idCard,
          });
        if (taxCard?.[0] && existingEmployee.document?.taxCard)
          filesToDelete.push({
            fieldname: "taxCard",
            filename: existingEmployee.document.taxCard,
          });
        if (familyCard?.[0] && existingEmployee.document?.familyCard)
          filesToDelete.push({
            fieldname: "familyCard",
            filename: existingEmployee.document.familyCard,
          });
        if (diploma?.[0] && existingEmployee.document?.diploma)
          filesToDelete.push({
            fieldname: "diploma",
            filename: existingEmployee.document.diploma,
          });

        // Tambahkan path lengkap
        const deleteFiles = getFilesToDelete(filesToDelete);

        // Hapus file lama setelah pembaruan sukses
        cleanupUploadedFiles(deleteFiles);

        // const deleteFileIfExists = async (filePath: any) => {
        //   if (
        //     filePath &&
        //     filePath !== updatedEmployee.image &&
        //     filePath !== updatedEmployee.document?.idCard &&
        //     filePath !== updatedEmployee.document?.taxCard &&
        //     filePath !== updatedEmployee.document?.familyCard &&
        //     filePath !== updatedEmployee.document?.diploma
        //   ) {
        //     try {
        // await unlinkAsync(`public/images/employees/${filePath}`);
        //     } catch (error) {
        //       console.error(`Failed to delete file: ${filePath}`, error);
        //     }
        //   }
        // };
        // await deleteFileIfExists(existingEmployee.image);
        // await deleteFileIfExists(existingEmployee.document?.idCard);
        // await deleteFileIfExists(existingEmployee.document?.taxCard);
        // await deleteFileIfExists(existingEmployee.document?.familyCard);
        // await deleteFileIfExists(existingEmployee.document?.diploma);

        res.status(StatusCodes.OK).json(updatedEmployee);
      } else {
        // cleanupUploadedFiles(uploadedFiles);
        return handleUnprocessableEntityResponse(res, error.details[0].message);
      }
    } catch (err: any) {
      if (err.code === "P1000" && err.message.includes("5432")) {
        return handleServerError(
          res,
          "Unable to connect to the database server. Please try again later."
        );
      }
      return handleServerError(
        res,
        "Internal Server Error. Please try again later."
      );
    }
  },
  deleteEmployee: async (req: Request, res: Response) => {
    try {
      const employeeId: string = req.params.id;
      const employee = await prisma.employees.findUniqueOrThrow({
        where: {
          id: employeeId,
        },
        include: {
          document: true,
        },
      });

      if (!employee) {
        return handleNotFoundResponse(res, "Data employee not found");
      }

      const deleteEmployee = await prisma.employees.delete({
        where: {
          id: employeeId,
        },
        include: {
          document: true,
        },
      });
      if (deleteEmployee) {
        const filesToDelete = [];

        // Cek file yang akan dihapus
        if (employee.image)
          filesToDelete.push({
            fieldname: "image",
            filename: employee.image,
          });
        if (employee.document?.idCard)
          filesToDelete.push({
            fieldname: "idCard",
            filename: employee.document.idCard,
          });
        if (employee.document?.taxCard)
          filesToDelete.push({
            fieldname: "taxCard",
            filename: employee.document.taxCard,
          });
        if (employee.document?.familyCard)
          filesToDelete.push({
            fieldname: "familyCard",
            filename: employee.document.familyCard,
          });
        if (employee.document?.diploma)
          filesToDelete.push({
            fieldname: "diploma",
            filename: employee.document.diploma,
          });
        const deleteFiles = getFilesToDelete(filesToDelete);
        cleanupUploadedFiles(deleteFiles);
      }
      if (!deleteEmployee)
        return handleUnprocessableEntityResponse(
          res,
          "Gagal menghapus data karyawan"
        );
      res.status(StatusCodes.OK).json({
        message: "Data karyawan berhasil dihapus.",
      });
    } catch (err: any) {
      if (err.code === "P1000" && err.message.includes("5432")) {
        return handleServerError(
          res,
          "Unable to connect to the database server. Please try again later."
        );
      }
      return handleServerError(res, "Error deleting. Please try again later.");
    }
  },
};

module.exports = EmployeeController;
