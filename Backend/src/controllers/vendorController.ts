import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createVendor = async (req: Request, res: Response) => {
  const { name, address, city, phone } = req.body;
  try {
    const newVendor = await prisma.vendors.create({
      data: { name, address, city, phone },
    });
    res.status(201).json(newVendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendors.findMany();
    res.status(200).json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};
