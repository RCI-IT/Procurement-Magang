import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Konfigurasi Multers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder tujuan penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nama file unik
  },
});

const upload = multer({ storage });

// Endpoint untuk membuat order
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
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Endpoint untuk mengambil semua order
app.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { detail: true },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Endpoint untuk membuat vendor
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
    console.error(error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Endpoint untuk mengambil semua vendor
app.get('/vendors', async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendors.findMany();
    res.status(200).json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Endpoint untuk membuat material
app.post('/materials', upload.single('image'), async (req: Request, res: Response) => {
  const { name, price, categoryId, vendorId } = req.body;
  const image = req.file?.filename || 'default-image.jpg'; // Default jika file tidak diunggah

  try {
    const newMaterial = await prisma.materials.create({
      data: {
        image,
        name,
        price: parseFloat(price), // Konversi string ke number
        categoryId: parseInt(categoryId), // Konversi ke Int
        vendorId: parseInt(vendorId), // Konversi ke Int
      },
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create material' });
  }
});

// Endpoint untuk membuat kategori
app.post('/categories', async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.categories.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Endpoint untuk membuat pembelian
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
    console.error(error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Endpoint untuk membuat detail pembelian
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
    console.error(error);
    res.status(500).json({ error: 'Failed to create detail purchase' });
  }
});

// Jalankan server
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di port ${PORT}`);
});
