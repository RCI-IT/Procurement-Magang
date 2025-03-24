"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.deleteCategory = exports.editCategory = exports.createCategory = exports.getAllCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.status(200).json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
exports.getAllCategories = getAllCategories;
const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const newCategory = await prisma.categories.create({
            data: { name },
        });
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};
exports.createCategory = createCategory;
const editCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await prisma.categories.update({
            where: { id: Number(id) }, // Konversi ID ke Number
            data: { name },
        });
        res.status(200).json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};
exports.editCategory = editCategory;
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.categories.delete({
            where: { id: Number(id) }, // Konversi ID ke Number
        });
        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
exports.deleteCategory = deleteCategory;
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
            res.status(400).json({ error: "Invalid category ID" });
            return;
        }
        const category = await prisma.categories.findUnique({
            where: { id: parsedId },
        });
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Failed to fetch category" });
    }
};
exports.getCategoryById = getCategoryById;
