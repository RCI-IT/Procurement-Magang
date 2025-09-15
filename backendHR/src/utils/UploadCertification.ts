import multer from "multer";
import * as path from "path";
import fs from "fs";

// Base directory untuk upload
const BASE_UPLOAD_DIR = path.join(__dirname, "../public/certificate");

const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureFolderExists(BASE_UPLOAD_DIR);
    cb(null, BASE_UPLOAD_DIR);
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
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed!"), false);
  }
};

const limits = {
  fileSize: 2 * 1024 * 1024,
};

export const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
}).single("certificate");

export const uploadedFilePath = (req: any): string | null => {
  if (req.file && req.file.path) {
    return req.file ? req.file.filename : null;
  }
  return null;
};

const getFilenameOrDefault = (file?: Express.Multer.File): string | null => {
  return file ? file.filename : null;
};

export const fileLocToDelete = (filename: any): string | null => {
  const folder = path.join(BASE_UPLOAD_DIR, filename);
  return folder;
};

export const deleteFileIfExists = (filePath: string | null) => {
  if (filePath) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
