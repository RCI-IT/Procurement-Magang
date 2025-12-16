// Middleware HR untuk cek token ke Auth Service
// Menggunakan native fetch (Node.js 18+)
import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../types/authPayload";

export const authProxy = async (
  req: AuthPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization header tidak ada",
      });
    }

    // Kirim token ke auth-service untuk diverifikasi
    const response = await fetch(
      `${process.env.AUTH_SERVICE_URL}/auth/verify`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    // Jika auth-service menolak token
    if (!response.ok) {
      return res.status(401).json({
        message: "Token tidak valid (auth service)",
      });
    }

    // Ambil data user dari auth-service
    const data = await response.json();

    // Simpan info user untuk controller berikutnya
    req.user = data.user;

    next();
  } catch (error) {
    console.error("Auth proxy error:", error);
    return res.status(500).json({
      message: "Auth service tidak dapat dihubungi",
    });
  }
};
