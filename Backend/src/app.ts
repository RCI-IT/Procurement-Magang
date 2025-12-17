import express from "express";
import cors from "cors";

import auth from "./routes/auth";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: "http://localhost:4000",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", auth);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
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

app.use(authMiddleware);

export default app;
