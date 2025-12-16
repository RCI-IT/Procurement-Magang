// middleware/auth.middleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/authInterface";
import jwt from "jsonwebtoken";


export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token tidak ada" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Token tidak valid" });
    return;
  }
};
