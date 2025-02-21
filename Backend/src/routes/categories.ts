import express from 'express';
import { createCategory, getAllCategories, editCategory, deleteCategory } from '../controllers/categoryController';

const router = express.Router();

router.post('/', createCategory);
router.get('/', getAllCategories);
router.put('/:id', editCategory);
router.delete('/:id', deleteCategory);

export default router;