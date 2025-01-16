import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Route untuk menambah permintaan baru
app.post('/api/requests', async (req, res) => {
  const { item, quantity, requestedBy } = req.body;

  try {
    const newRequest = await prisma.request.create({
      data: {
        item,
        quantity,
        requestedBy,
      },
    });
    res.status(201).json(newRequest);
  } catch (error: any) { // Menambahkan tipe 'any' pada error
    res.status(400).json({ message: error.message });
  }
});

// Route untuk mendapatkan semua permintaan
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await prisma.request.findMany();
    res.status(200).json(requests);
  } catch (error: any) { // Menambahkan tipe 'any' pada error
    res.status(400).json({ message: error.message });
  }
});

// Mulai server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
