import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  const { number, contractNumber, location, requestBy, detail } = req.body;
  try {
    const newOrder = await prisma.order.create({
      data: {
        number,
        contractNumber,
        location,
        requestBy,
        detail: { create: detail },
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { detail: true },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
