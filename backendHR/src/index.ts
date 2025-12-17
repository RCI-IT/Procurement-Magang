import express, { Application, Request, Response } from "express";
// import multer from "multer";
import dotenv from "dotenv"; // untuk membaca environment
import { StatusCodes } from "http-status-codes"; // Untuk error handling
// import userRoutes from "./routes/UserRoutes"
import { Employee } from "./routes/EmployeeRoutes";
import { Certification } from "./routes/CertificationRoutes";
import { authProxy } from "./middleware/auth.proxy.middleware";
import path from "path";
const fs = require('fs');

const cors = require('cors');

// import {Employee} from "./routes/EmployeeRoutes";

dotenv.config();

const app: Application = express();
const PORT: any = process.env.PORT;

// Konfigurasi CORS
const corsOptions = {
  origin: '*', // Domain frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Tambahkan header yang diperlukan
  // credentials: true, // Jika menggunakan cookie
};


app.use(express.json());
app.use(cors(corsOptions));

// app.use("/v1", userRoutes);
app.use('/api/employees', authProxy, Employee);
app.use('/api/certification', Certification);



// const upload = multer({ storage: multer.memoryStorage() }); // Middleware untuk menangani multipart/form-data

// app.post('/upload',upload.any(), (req, res) => {
//     console.log('Body:', req.body); // Untuk melihat data teks
//     console.log('Files:', req.files); // Untuk melihat data file (jika ada)

//     res.json({ message: 'Data diterima', data: req.body, files: req.files });
// });


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Prisma with PostgreSQL!");
});

// Middleware untuk melayani file statis (termasuk gambar)
app.use('/images', express.static(path.join(__dirname, 'public/uploads/images')));
app.use('/ijazah', express.static(path.join(__dirname, 'public/uploads/diplomas')));
app.use('/kartukeluarga', express.static(path.join(__dirname, 'public/uploads/familyCards')));
app.use('/ktp', express.static(path.join(__dirname, 'public/uploads/idCards')));
app.use('/npwp', express.static(path.join(__dirname, 'public/uploads/taxCards')));

// Middleware untuk menyetel header Content-Disposition ke 'inline' untuk file PDF
app.use('/certificate', (req, res, next) => {
  if (req.path.endsWith('.pdf')) {
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Type', 'application/pdf');
  }
  next();
});

// Static file handler
app.use('/certificate', express.static(path.join(__dirname, 'public/certificate')));

// Error Handling
app.use((_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send("Not Found");
});
app.use((err: any, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
});

// Server Setup
app.listen(PORT,'0.0.0.0', () => {
  console.log("Server running on http://0.0.0.0:4000");
});
