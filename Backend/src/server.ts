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
  console.log(req.body); // Log isi body request
  try {
    const { number, contractNumber, location, requestBy, detail } = req.body;
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
app.post('/materials', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, categoryId, vendorId, description } = req.body;
    const image = req.file?.filename || 'default-image.jpg';

    if (!name || !price || !categoryId || !vendorId || !description) {
      res.status(400).json({ error: 'All fields including description are required' });
      return;
    }

    const newMaterial = await prisma.materials.create({
      data: {
        image,
        name,
        description,
        price: parseInt(price, 10),
        categoryId: parseInt(categoryId, 10),
        vendorId: parseInt(vendorId, 10),
      },
    });

    res.status(201).json(newMaterial); // Tidak perlu `return` di sini
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
// Endpoint untuk membuat user baru
app.post('/users', async (req: Request, res: Response): Promise<void> => {
  const { username, password, email, fullName, role } = req.body;
  
  // Validasi input
  if (!username || !password || !email || !fullName || !role) {
    res.status(400).json({ error: 'All fields are required' });
    return; // Menghentikan eksekusi lebih lanjut
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        email,
        fullName,
        role,
      },
    });

    res.status(201).json(newUser); // Kirimkan respons, jangan mengembalikan apapun
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Endpoint untuk mendapatkan semua users
app.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users); // Kirimkan respons, jangan mengembalikan apapun
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Endpoint untuk mendapatkan user berdasarkan ID
app.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    res.status(200).json(user); // Kirimkan respons, jangan mengembalikan apapun
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Endpoint untuk mengupdate user
app.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { fullName, email, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { fullName, email, role },
    });

    res.status(200).json(updatedUser); // Kirimkan respons, jangan mengembalikan apapun
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Endpoint untuk menghapus user
app.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).send(); // Response tanpa body
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Jalankan server
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di port ${PORT}`);
});
