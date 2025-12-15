// controllers/refresh.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "@/utils/generateToken";

const prisma = new PrismaClient();

export const refreshToken = async (req: Request, res: Response) => {
  const tokenFromCookie = req.cookies.refreshToken;

  if (!tokenFromCookie) {
    return res.status(401).json({ message: "Refresh token tidak ada" });
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: tokenFromCookie },
    include: {
      user: {
        include: {
          roles: { include: { role: true } },
        },
      },
    },
  });

  if (
    !storedToken ||
    storedToken.revoked ||
    storedToken.expiresAt < new Date()
  ) {
    return res.status(403).json({ message: "Refresh token tidak valid" });
  }

  const roles = storedToken.user.roles.map(r => r.role.roleName);

  const newAccessToken = generateToken({
    userId: storedToken.user.id,
    username: storedToken.user.username,
    roles,
  });

  res.json({ token: newAccessToken });
};
