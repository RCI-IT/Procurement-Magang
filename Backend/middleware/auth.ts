// middleware/auth.ts
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized", message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    // Validasi token, misalnya dengan JWT (Anda bisa menggunakan JWT atau lainnya)
    // const user = validateToken(token); // Logika validasi token Anda di sini

    if (!token) {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
    }

    // Lanjutkan jika token valid
    next();
};
