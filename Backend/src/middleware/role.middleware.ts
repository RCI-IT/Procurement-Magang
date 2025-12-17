import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/authInterface";

export function roleMiddleware(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 🔐 pastikan authMiddleware / authProxy sudah jalan
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized - user belum terautentikasi",
      });
    }

    const userRoles = req.user.roles || [];

    const hasAccess = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasAccess) {
      return res.status(403).json({
        message: "Forbidden - role tidak diizinkan",
      });
    }

    next();
  };
}
