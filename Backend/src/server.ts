import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Create a new order
app.post("/orders", async (req: Request, res: Response) => {
  const { number, contractNumber, location, requestBy, detail } = req.body;

  try {
    if (!detail || detail.length === 0) {
      return res.status(400).json({ error: "Order detail is required" });
    }

    const order = await prisma.order.create({
      data: {
        number,
        contractNumber,
        location,
        requestBy,
        detail: {
          create: detail.map((d: any) => ({
            materialId: d.id, // Ganti materialId dengan id sesuai dengan field yang ada di schema
            qty: d.qty,
            mention: d.mention,
          })),
        },
      },
    });
    res.status(201).json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating order:", error.message);
      res.status(500).json({ error: "Failed to create order", details: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
});

// Get all materials
app.get("/materials", async (req: Request, res: Response) => {
  try {
    const materials = await prisma.materials.findMany({
      include: {
        category: true,
        vendor: true,
      },
    });
    res.json(materials);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching materials:", error.message);
      res.status(500).json({ error: "Failed to fetch materials", details: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
});

// Create a new material
app.post("/materials", async (req: Request, res: Response) => {
  const { name, price, categoryId, vendorId, image } = req.body;

  try {
    const material = await prisma.materials.create({
      data: {
        name,
        price,
        categoryId,
        vendorId,
        image,
      },
    });
    res.status(201).json(material);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating material:", error.message);
      res.status(500).json({ error: "Failed to create material", details: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
});

// Get all purchases
app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchases.findMany({
      include: {
        detail: {
          include: {
            material: true,
            order: true,
          },
        },
      },
    });
    res.json(purchases);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching purchases:", error.message);
      res.status(500).json({ error: "Failed to fetch purchases", details: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
});

// Create a new purchase
app.post("/purchases", async (req: Request, res: Response) => {
  const { number, refrence, detail, subtotal, tax, totalPayment, payment, createBy } = req.body;

  try {
    const purchase = await prisma.purchases.create({
      data: {
        number,
        refrence,
        subtotal,
        tax,
        totalPayment,
        payment,
        createBy,
        detail: {
          create: detail.map((d: any) => ({
            materialId: d.id, // Ganti materialId dengan id sesuai dengan field yang ada di schema
            orderId: d.orderId,
            codeBudget: d.codeBudget,
            mention: d.mention,
            qty: d.qty,
            price: d.price,
            totalPrice: d.totalPrice,
          })),
        },
      },
    });
    res.status(201).json(purchase);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating purchase:", error.message);
      res.status(500).json({ error: "Failed to create purchase", details: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
