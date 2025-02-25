import express from "express";
import cors from "cors";
import permintaanRoutes from "./routes/permintaan";
import vendorsRoutes from "./routes/vendors";
import materialsRoutes from "./routes/materials";
import categoriesRoutes from "./routes/categories";
import usersRoutes from "./routes/users";
import path from 'path';

const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/permintaan", permintaanRoutes);
app.use("/vendors", vendorsRoutes);
app.use("/materials", materialsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
  next(); // Melanjutkan error untuk ke middleware lain jika ada
});
export default app;
