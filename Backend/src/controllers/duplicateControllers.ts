import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
type TableKey = keyof typeof prismaModelMap;

const prismaModelMap = {
  user: prisma.user,
  permintaan: prisma.permintaanLapangan,
  materials: prisma.materials,
};

export const duplicateCHECK = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { table, values } = req.body;

  if (!table || !values) {
    res.status(400).json({ error: "Table dan values harus disediakan" });
    return;
  }

  const model = prismaModelMap[table as TableKey];
  if (!model) {
    res.status(400).json({ error: "Model tidak ditemukan" });
    return;
  }

  const result: Record<string, boolean> = {};

  try {
    for (const field in values) {
      const value = values[field];
      const whereClause: Record<string, any> = {};
      whereClause[field] = value;

      const existing = await (model as any).findFirst({ where: whereClause });
      result[field] = !!existing;
    }

    res.json(result);
    return;
  } catch (error) {
    console.error("Error cek duplikat:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat cek duplikat" });
    return;
  }
};
