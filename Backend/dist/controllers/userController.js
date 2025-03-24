"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = async (req, res) => {
    const { username, password, email, fullName, role } = req.body;
    if (!username || !password || !email || !fullName || !role) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    try {
        const newUser = await prisma.user.create({
            data: { username, password, email, fullName, role },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { fullName, email, role } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { fullName, email, role },
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).send(); // Mengirimkan response tanpa body
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
