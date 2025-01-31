import express from 'express';
import { createVendor, getAllVendors } from '../controllers/vendorController';

const router = express.Router();

router.post('/', createVendor);
router.get('/', getAllVendors);

export default router;
