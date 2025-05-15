import express from "express";
import cors from "cors";
import permintaanRoutes from "./routes/permintaan";
import vendorsRoutes from "./routes/vendors";
import materialsRoutes from "./routes/materials";
import categoriesRoutes from "./routes/categories";
import usersRoutes from "./routes/users";
import confirmationRoutes from "./routes/confirmation";
import purchaseRoutes from "./routes/purchase";
import authMiddleware from "./middleware/authMiddleware";
import auth from "./routes/auth"
import path from "path";

// import cookieParser from "cookie-parser";

const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
};

app.use(cors(corsOptions));
// app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use("/auth", auth);
app.use(authMiddleware);

// Protected routes (hanya bisa diakses setelah login)
app.use("/permintaan", permintaanRoutes);
app.use("/vendors", vendorsRoutes);
app.use("/materials", materialsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);
app.use("/confirmation", confirmationRoutes);
app.use("/purchase", purchaseRoutes);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
  next();
});

export default app;
