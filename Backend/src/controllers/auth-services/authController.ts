import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "@/utils/generateToken";

const prisma = new PrismaClient();

// User dummy
const defaultUser = {
  username: "admin",
  password: "admin123",
  email: "admin@system.local",
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // 👉 Cek apakah database kosong (tidak ada user)
    const userCount = await prisma.authUser.count();
    if (userCount === 0) {
      console.log("⚠️ Tidak ada user, membuat user default...");
      const hashedPassword = await bcrypt.hash(defaultUser.password, 10);

      const adminRole = await prisma.authRole.upsert({
        where: { roleName: "ADMIN" },
        update: {},
        create: { roleName: "ADMIN" },
      });

      await prisma.authUser.create({
        data: {
          username: defaultUser.username,
          email: defaultUser.email,
          password: hashedPassword,
          roles: {
            create: {
              roleId: adminRole.id,
            },
          },
        },
      });
    }

    // 2️⃣ cari user
    const user = await prisma.authUser.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    if (!user) {
      res.status(401).json({ error: "There is no user." });
      return;
    }

    // 3️⃣ validasi password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // 4️⃣ generate JWT
    const token = generateToken({ id: user.id, username: user.username });
    const roleNames = user.roles.map((r) => r.role.roleName);

    // REFRESH TOKEN (random string)
    const refreshToken = crypto.randomBytes(64).toString("hex");

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // true di production
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        token: token,
        user: {
          id: user.id,
          username: user.username,
          roles: roleNames,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  res.clearCookie("refreshToken").json({ message: "Logout berhasil" });
};

export const regist = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.authUser.create({
      data: { username, email, password: hashedPassword },
    });
  } catch (error: any) {
    // Cek apakah username dan email sudah ada, karena UNIQUE constraint Prisma + DB
    if (error.code === "P2002") {
      const target = error.meta?.target?.[0];

      if (target === "username") {
        return res.status(409).json({ message: "Username sudah digunakan" });
      }

      if (target === "email") {
        return res.status(409).json({ message: "Email sudah digunakan" });
      }

      return res.status(409).json({
        message: "Username atau email sudah digunakan",
      });
    }
    throw error;
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { rolesAdd = [], rolesRemove = [] } = req.body;

  try {
    await prisma.$transaction([
      // ➕ Tambah role baru (jika ada)
      prisma.authUserRole.createMany({
        data: rolesAdd.map((roleId: string) => ({
          userId,
          roleId,
        })),
        skipDuplicates: true, // aman dari duplicate
      }),

      // ➖ Hapus role
      prisma.authUserRole.deleteMany({
        where: {
          userId,
          roleId: { in: rolesRemove },
        },
      }),
    ]);

    res.json({
      message: "Role user berhasil diperbarui",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal memperbarui role user",
    });
    return;
  }
};
