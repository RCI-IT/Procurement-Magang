"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaterialById = exports.editMaterial = exports.deleteMaterial = exports.getAllMaterials = exports.createMaterial = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path_1.default.extname(file.originalname);
        cb(null, filename);
    }
});
const upload = (0, multer_1.default)({ storage });
const createMaterial = async (req, res) => {
    var _a;
    try {
        console.log("Received Data:", req.body);
        const { name, description, price, categoryId, vendorId } = req.body;
        // Konversi data ke angka
        const parsedCategoryId = parseInt(categoryId, 10);
        const parsedPrice = parseFloat(price);
        const parsedVendorId = parseInt(vendorId, 10);
        if (isNaN(parsedCategoryId) || isNaN(parsedPrice) || isNaN(parsedVendorId)) {
            res.status(400).json({ error: "Invalid categoryId, price, or vendorId" });
            return;
        }
        const image = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || "default-image.jpg";
        const newMaterial = await prisma.materials.create({
            data: {
                image,
                name,
                description,
                price: parsedPrice,
                categoryId: parsedCategoryId,
                vendorId: parsedVendorId,
            },
        });
        res.status(201).json(newMaterial);
    }
    catch (error) {
        console.error("Error in createMaterial:", error);
        res.status(500).json({ error: "Failed to create material" });
    }
};
exports.createMaterial = createMaterial;
const getAllMaterials = async (req, res) => {
    try {
        const materials = await prisma.materials.findMany({
            include: {
                vendor: true, // Ambil data vendor terkait
            },
        });
        if (materials.length === 0) {
            res.status(404).json({ error: 'No materials found' });
            return;
        }
        res.status(200).json(materials);
    }
    catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ error: 'Failed to fetch materials' });
    }
};
exports.getAllMaterials = getAllMaterials;
const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            res.status(400).json({ error: "Invalid material ID" });
            return;
        }
        const material = await prisma.materials.findUnique({ where: { id: parsedId } });
        if (!material) {
            res.status(404).json({ error: "Material not found" });
            return;
        }
        await prisma.materials.delete({ where: { id: parsedId } });
        res.status(200).json({ message: "Material deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting material:", error);
        res.status(500).json({ error: "Failed to delete material" });
    }
};
exports.deleteMaterial = deleteMaterial;
const editMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, vendorId } = req.body;
        // Konversi data ke tipe yang sesuai
        const parsedId = parseInt(id, 10);
        const parsedCategoryId = parseInt(categoryId, 10);
        const parsedPrice = parseFloat(price);
        const parsedVendorId = parseInt(vendorId, 10);
        if (isNaN(parsedId) || isNaN(parsedCategoryId) || isNaN(parsedPrice) || isNaN(parsedVendorId)) {
            res.status(400).json({ error: "Invalid ID, categoryId, price, or vendorId" });
            return;
        }
        // Cek apakah material dengan ID tersebut ada di database
        const material = await prisma.materials.findUnique({ where: { id: parsedId } });
        if (!material) {
            res.status(404).json({ error: "Material not found" });
            return;
        }
        // Jika ada file gambar baru, hapus gambar lama dan simpan yang baru
        let newImage = material.image;
        if (req.file) {
            if (material.image && material.image !== "default-image.jpg") {
                fs_1.default.unlinkSync(`uploads/${material.image}`); // Hapus gambar lama
            }
            newImage = req.file.filename;
        }
        // Update material di database
        const updatedMaterial = await prisma.materials.update({
            where: { id: parsedId },
            data: {
                name,
                description,
                price: parsedPrice,
                categoryId: parsedCategoryId,
                vendorId: parsedVendorId,
                image: newImage,
            },
        });
        res.status(200).json(updatedMaterial);
    }
    catch (error) {
        console.error("Error updating material:", error);
        res.status(500).json({ error: "Failed to update material" });
    }
};
exports.editMaterial = editMaterial;
const getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            res.status(400).json({ error: "Invalid material ID" });
            return;
        }
        const material = await prisma.materials.findUnique({
            where: { id: parsedId },
            include: { vendor: true, category: true }, // Tambahkan relasi vendor & kategori
        });
        if (!material) {
            res.status(404).json({ error: "Material not found" });
            return;
        }
        // Format ulang response agar lebih rapi
        const formattedResponse = {
            id: material.id,
            name: material.name,
            description: material.description,
            price: `Rp ${material.price.toLocaleString("id-ID")}`,
            category: material.category ? material.category.name : "Unknown Category",
            vendor: material.vendor ? material.vendor.name : "Unknown Vendor",
            imageUrl: `http://192.168.110.205:5000/uploads/${material.image}`,
            createdAt: new Date(material.createdAt).toLocaleString("id-ID"),
            updatedAt: new Date(material.updatedAt).toLocaleString("id-ID"),
        };
        res.status(200).json(formattedResponse);
    }
    catch (error) {
        console.error("Error fetching material:", error);
        res.status(500).json({ error: "Failed to fetch material" });
    }
};
exports.getMaterialById = getMaterialById;
