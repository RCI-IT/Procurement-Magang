import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/authInterface";

export function roleMiddleware(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRoles = req.user.roles;

    const hasAccess = userRoles.some((r: string) => allowedRoles.includes(r));

    if (!hasAccess) {
      return res.status(403).json({
        message: "Forbidden - role tidak diizinkan",
      });
    }

    next();
  };
}
