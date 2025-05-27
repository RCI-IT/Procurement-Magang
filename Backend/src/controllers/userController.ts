import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, email, fullName, role } = req.body;
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

  if (username) whereClause.username = Number(username);
  if (email) {
    whereClause.email = {
      contains: String(email), // pencarian partial 
      mode: "insensitive", // (case-insensitive bisa ditambah)
    };
  }

  try {
    const users = await prisma.user.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    });
    res.status(200).json(users);
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
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
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
  const { fullName, email, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { fullName, email, role },
    });

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
