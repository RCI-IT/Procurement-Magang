import express from "express";
import cors from "cors"; // Mengimpor CORS
import permintaanRoutes from "./routes/permintaan";
import vendorsRoutes from "./routes/vendors";
import materialsRoutes from "./routes/materials";
import categoriesRoutes from "./routes/categories";
import usersRoutes from "./routes/users";
import path from 'path';

const app = express();



// Middleware untuk CORS
const corsOptions = {
  origin: "*",  // Ganti dengan URL frontend Anda jika di luar localhost
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

//test
app.use(cors(corsOptions)); // Menggunakan CORS untuk semua rute
// Konfigurasi untuk melayani file statis (gambar) dari folder 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));



// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute-rute yang sudah didefinisikan di file routes
app.use("/permintaan", permintaanRoutes); // Menggunakan rute permintaan
app.use("/vendors", vendorsRoutes);
app.use("/materials", materialsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);

// Middleware untuk menangani error secara global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
  next(); // Melanjutkan error untuk ke middleware lain jika ada
});

export default app; // Menyediakan aplikasi untuk digunakan di server.ts
