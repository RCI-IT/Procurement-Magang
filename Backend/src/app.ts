// 🔧 Core Modules
import path from "path";

// 📦 Third-party Modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// 📁 Routes
import auth from "./routes/auth";
import permintaanRoutes from "./routes/permintaan";
import vendorsRoutes from "./routes/vendors";
import materialsRoutes from "./routes/materials";
import categoriesRoutes from "./routes/categories";
import usersRoutes from "./routes/users";
import confirmationRoutes from "./routes/confirmation";
import purchaseRoutes from "./routes/purchase";
import sign from "./routes/sign";

// 🔒 Middleware
import authMiddleware from "./middleware/authMiddleware";

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.110.253:3000",
    "http://192.168.110.5:3000",
    "http://procurement.rci:3000",
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
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
app.use("/signing", sign);
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
    next();
  }
);

export default app;
