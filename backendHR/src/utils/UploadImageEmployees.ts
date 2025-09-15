import multer from "multer";
import * as path from "path";
import fs from "fs";

// Base directory untuk upload
const BASE_UPLOAD_DIR = path.join(__dirname, "../public/uploads");

// Fungsi untuk memastikan folder ada sebelum menyimpan file
const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = path.join(BASE_UPLOAD_DIR, "others"); // Default folder

    switch (file.fieldname) {
      case "image":
        folder = path.join(BASE_UPLOAD_DIR, "images");
        break;
      case "idCard":
        folder = path.join(BASE_UPLOAD_DIR, "idCards");
        break;
      case "taxCard":
        folder = path.join(BASE_UPLOAD_DIR, "taxCards");
        break;
      case "familyCard":
        folder = path.join(BASE_UPLOAD_DIR, "familyCards");
        break;
      case "diploma":
        folder = path.join(BASE_UPLOAD_DIR, "diplomas");
        break;
    }

    ensureFolderExists(folder); // Pastikan folder ada sebelum menyimpan file
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileNameWithoutExt = path.basename(file.originalname, fileExtension); // Hapus ekstensi

    cb(null, `${fileNameWithoutExt}-${uniqueSuffix}${fileExtension}`);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const limits = {
  fileSize: 2 * 1024 * 1024,
};

const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

export const UploadImageEmployee = uploads.fields([
  { name: "image" },
  { name: "idCard" },
  { name: "taxCard" },
  { name: "familyCard" },
  { name: "diploma" },
]);

// Fungsi untuk menyimpan daftar file yang diunggah
export const getUploadedFilePaths = (req: any): string[] => {
  const uploadedFiles: string[] = [];
  const fileFields = ["image", "idCard", "taxCard", "familyCard", "diploma"];

  fileFields.forEach((field) => {
    if (req.files && req.files[field]) {
      (req.files[field] as Express.Multer.File[]).forEach((file) => {
        uploadedFiles.push(file.path);
      });
    }
  });

  return uploadedFiles;
};

// Fungsi untuk menghapus file jika terjadi error
export const cleanupUploadedFiles = (files: string[]) => {
  files.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", filePath, err);
    });
  });
};

// Fungsi untuk mendapatkan daftar file lama yang perlu dihapus jika ada perubahan
export const getFilesToDelete = (
  files: { fieldname: string; filename: string }[]
) => {
  return files
    .filter((file) => file.filename) // Pastikan tidak ada nilai `undefined` atau `null`
    .map(({ fieldname, filename }) => {
      let folder = path.join(BASE_UPLOAD_DIR, "others"); // Default folder

      switch (fieldname) {
        case "image":
          folder = path.join(BASE_UPLOAD_DIR, "images");
          break;
        case "idCard":
          folder = path.join(BASE_UPLOAD_DIR, "idCards");
          break;
        case "taxCard":
          folder = path.join(BASE_UPLOAD_DIR, "taxCards");
          break;
        case "familyCard":
          folder = path.join(BASE_UPLOAD_DIR, "familyCards");
          break;
        case "diploma":
          folder = path.join(BASE_UPLOAD_DIR, "diplomas");
          break;
      }

      return path.join(folder, filename);
    });
};
