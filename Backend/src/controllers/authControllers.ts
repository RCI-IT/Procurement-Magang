import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import users from "../utils/users";

// Gunakan UUID atau JWT di produksi
// const SESSION_TOKEN = "abc123";

interface User {
  username: string;
  password: string;
  role: string;
}
const prisma = new PrismaClient();
// REGISTER
// export const register = async (req: Request, res: Response): Promise<void> => {
//   const { username, password, role } = req.body;

//   if (!username || !password || !role) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const existingUser = users.find((u: User) => u.username === username);
//   if (existingUser) {
//     return res.status(409).json({ message: "User already exists" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   users.push({ username, password: hashedPassword, role });

//   return res.status(201).json({ message: "Registration successful" });
// };

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isMatchNoCrypt = await (password === user.password);
    if (!isMatch && !isMatchNoCrypt) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Set cookie
    // res.cookie("session_token", SESSION_TOKEN, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 3600000, // 1 jam
    // });
    // Buat JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1m" } // Token akan expire dalam 1 jam
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d", // lebih lama
      }
    );

    // Kirim token ke client
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      })
      .json({
        message: "Login successful",
        token, // atau token: token
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!,
    (err: jwt.VerifyErrors | null, user: string | JwtPayload | undefined) => {
      if (err) return res.sendStatus(403);
      const newAccessToken = jwt.sign(
        { username: (user as any).username },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );
      return res.json({ message: "Token Refresh", token, newAccessToken });
    }
  );
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ message: "Logout successful" });
};

// LOGOUT
// export const logout = (req: Request, res: Response): any => {
//   res.clearCookie("session_token");
//   res.json({ message: "Logout successful" });
// };
