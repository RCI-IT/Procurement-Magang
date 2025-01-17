import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { loggerMiddleware } from "./middleware/logger"; // Middleware logging
import { authMiddleware } from "./middleware/auth"; // Middleware autentikasi

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware bawaan Express untuk membaca JSON
app.use(loggerMiddleware); // Terapkan middleware logging secara global

// Endpoint untuk membuat order (dengan autentikasi)
app.post("/orders", authMiddleware, async (req: Request, res: Response) => {
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
                        materialId: d.id, // Sesuaikan field sesuai schema Prisma
                        qty: d.qty,
                        mention: d.mention,
                    })),
                },
            },
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order", details: error });
    }
});

// Endpoint lain (tanpa autentikasi, sebagai contoh)
app.get("/materials", async (req: Request, res: Response) => {
    try {
        const materials = await prisma.materials.findMany();
        res.json(materials);
    } catch (error) {
        console.error("Error fetching materials:", error);
        res.status(500).json({ error: "Failed to fetch materials" });
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

