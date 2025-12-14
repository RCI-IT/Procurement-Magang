import { Request, Response } from "express";
import { PrismaClient, SigningAuthority, UserRole, User } from "@prisma/client";
import bcrypt from "bcryptjs";

type UserWithAuthorities = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  SigningAuthority: SigningAuthority[];
};

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, email, fullName, role: roleString} = req.body;

  if (!Object.values(UserRole).includes(roleString)) {
    res.status(400).json({ error: "Invalid role" });
    return;
  }
  const role = roleString as UserRole;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!username || !password || !email || !fullName || !role) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, email, fullName, role },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email } = req.query;
  const whereClause: any = {};

  // Pencarian username (pakai contains juga biar konsisten)
  if (username) {
    whereClause.username = {
      contains: String(username),
      mode: "insensitive",
    };
  }

  // Pencarian email (partial + case-insensitive)
  if (email) {
    whereClause.email = {
      contains: String(email),
      mode: "insensitive",
    };
  }

  try {
    const users = await prisma.user.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: { SigningAuthority: true }, // <-- tambahkan signingAuthorities
    });

    // supaya frontend gampang pakai (biar sama kayak getById)
    const formattedUsers = users.map((user: UserWithAuthorities) => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      authorities: user.SigningAuthority.map((auth: SigningAuthority) => ({
        fileType: auth.fileType,
        role: auth.role,
      })),
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { SigningAuthority: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      authorities: user.SigningAuthority.map((auth: SigningAuthority) => ({
        fileType: auth.fileType,
        role: auth.role,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { fullName, email, role, authorities } = req.body;

  try {
    // Update basic user data
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        email,
        role,
      },
    });

    // Handle signingAuthorities (replace all)
    if (Array.isArray(authorities)) {
      // Delete existing authorities
      await prisma.signingAuthority.deleteMany({
        where: { userId: id },
      });

      // Create new authorities
      if (authorities.length > 0) {
        await prisma.signingAuthority.createMany({
          data: authorities.map((auth: any) => ({
            userId: id,
            fileType: auth.fileType,
            role: auth.role,
          })),
        });
      }
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
