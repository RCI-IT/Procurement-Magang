import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createPurchase = async (req: Request, res: Response) => {
  const { number, refrence, subtotal, tax, totalPayment, payment, createBy, detail } = req.body;
  try {
    const newPurchase = await prisma.purchases.create({
      data: {
        number,
        refrence,
        subtotal,
        tax,
        totalPayment,
        payment,
        createBy,
        detail: { create: detail },
      },
    });
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
};
