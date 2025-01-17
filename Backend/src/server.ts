import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Endpoint to create an order
app.post('/orders', async (req: Request, res: Response) => {
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
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Endpoint to fetch all orders
app.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { detail: true },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Endpoint to create a vendor
app.post('/vendors', async (req: Request, res: Response) => {
  const { name, address, city, phone } = req.body;
  try {
    const newVendor = await prisma.vendors.create({
      data: {
        name,
        address,
        city,
        phone,
      },
    });
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Endpoint to fetch all vendors
app.get('/vendors', async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendors.findMany();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Endpoint to create materials
app.post('/materials', async (req: Request, res: Response) => {
  const { image, name, price, categoryId, vendorId } = req.body;
  try {
    const newMaterial = await prisma.materials.create({
      data: {
        image,
        name,
        price,
        categoryId,
        vendorId,
      },
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create material' });
  }
});

// Endpoint to create categories
app.post('/categories', async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.categories.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Endpoint to create purchases
app.post('/purchases', async (req: Request, res: Response) => {
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
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Endpoint to create detail purchases
app.post('/detail-purchases', async (req: Request, res: Response) => {
  const { purchaseId, materialId, orderId, codeBudget, mention, qty, price, totalPrice } = req.body;
  try {
    const newDetailPurchase = await prisma.detailPurchases.create({
      data: {
        purchaseId,
        materialId,
        orderId,
        codeBudget,
        mention,
        qty,
        price,
        totalPrice,
      },
    });
    res.status(201).json(newDetailPurchase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create detail purchase' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});