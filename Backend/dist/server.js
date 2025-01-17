"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.post("/orders", async (req, res, next) => {
    try {
        const { number, contractNumber, location, requestBy, detail } = req.body;
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
                    create: detail.map((d) => ({
                        materialId: d.id,
                        qty: d.qty,
                        mention: d.mention,
                    })),
                },
            },
        });
        res.status(201).json(order);
    }
    catch (error) {
        next(error); // Forward error to middleware
    }
});
// Get all materials
app.get("/materials", async (req, res) => {
    try {
        const materials = await prisma.materials.findMany({
            include: {
                category: true,
                vendor: true,
            },
        });
        res.json(materials);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching materials:", error.message);
            res.status(500).json({ error: "Failed to fetch materials", details: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    }
});
// Create a new material
app.post("/materials", async (req, res) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error creating material:", error.message);
            res.status(500).json({ error: "Failed to create material", details: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    }
});
// Get all purchases
app.get("/purchases", async (req, res) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching purchases:", error.message);
            res.status(500).json({ error: "Failed to fetch purchases", details: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    }
});
// Create a new purchase
app.post("/purchases", async (req, res) => {
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
                    create: detail.map((d) => ({
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error creating purchase:", error.message);
            res.status(500).json({ error: "Failed to create purchase", details: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    }
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
