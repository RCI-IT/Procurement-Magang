import { Request, Response } from "express";
import { verifyAccessToken } from "@/utils/jwt";

export const verifyToken = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  // ❌ Tidak ada Authorization header
  if (!authHeader) {
    res.status(401).json({
      code: "NO_TOKEN",
      message: "Authorization header missing",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  // ❌ Format salah
  if (!token) {
    res.status(401).json({
      code: "INVALID_FORMAT",
      message: "Token format must be Bearer <token>",
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    // ✅ TOKEN VALID
    res.status(200).json({
      user: {
        id: decoded.sub,
        username: decoded.username,
        roles: decoded.roles,
      },
    });
    return;
  } catch (err: any) {
    // 🔥 TOKEN EXPIRED
    if (err.name === "TokenExpiredError") {
      res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Access token expired",
      });
      return;
    }

    // ❌ TOKEN INVALID
    res.status(401).json({
      code: "INVALID_TOKEN",
      message: "Token invalid",
    });
    return;
  }
};
