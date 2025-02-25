import express from 'express';
import { createCategory, getAllCategories, editCategory, deleteCategory, getCategoryById } from '../controllers/categoryController';

const router = express.Router();

router.post('/', createCategory);
router.get('/', getAllCategories);
router.put('/:id', editCategory);
router.delete('/:id', deleteCategory);
router.get('/:id', getCategoryById);

export default router;