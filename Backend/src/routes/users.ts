import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

// Rute untuk membuat user baru
router.post('/', createUser);

// Rute untuk mendapatkan semua users
router.get('/', getAllUsers);

// Rute untuk mendapatkan user berdasarkan ID
router.get('/:id', getUserById);

// Rute untuk mengupdate user
router.put('/:id', updateUser);

// Rute untuk menghapus user
router.delete('/:id', deleteUser);

export default router;
