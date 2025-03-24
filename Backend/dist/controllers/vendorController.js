"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorById = exports.deleteVendor = exports.editVendor = exports.getAllVendors = exports.createVendor = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createVendor = async (req, res) => {
    const { name, address, city, phone } = req.body;
    try {
        const newVendor = await prisma.vendors.create({
            data: { name, address, city, phone },
        });
        res.status(201).json(newVendor);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create vendor' });
    }
};
exports.createVendor = createVendor;
const getAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendors.findMany();
        res.status(200).json(vendors);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};
exports.getAllVendors = getAllVendors;
const editVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, city, phone } = req.body;
        const existingVendor = await prisma.vendors.findUnique({
            where: { id: Number(id) },
        });
        if (!existingVendor) {
            res.status(404).json({ error: "Vendor tidak ditemukan" });
            return;
        }
        const updatedVendor = await prisma.vendors.update({
            where: { id: Number(id) },
            data: { name, address, city, phone },
        });
        res.status(200).json({ message: "Vendor berhasil diperbarui", updatedVendor });
    }
    catch (error) {
        console.error("Error updating vendor:", error);
        res.status(500).json({ error: "Gagal memperbarui vendor" });
    }
};
exports.editVendor = editVendor;
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const existingVendor = await prisma.vendors.findUnique({
            where: { id: Number(id) },
        });
        if (!existingVendor) {
            res.status(404).json({ error: "Vendor tidak ditemukan" });
            return;
        }
        await prisma.vendors.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "Vendor berhasil dihapus" });
    }
    catch (error) {
        console.error("Error deleting vendor:", error);
        res.status(500).json({ error: "Gagal menghapus vendor" });
    }
};
exports.deleteVendor = deleteVendor;
const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await prisma.vendors.findUnique({
            where: { id: Number(id) },
        });
        if (!vendor) {
            res.status(404).json({ error: "Vendor tidak ditemukan" });
            return;
        }
        res.status(200).json(vendor);
    }
    catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ error: "Gagal mengambil data vendor" });
    }
};
exports.getVendorById = getVendorById;
