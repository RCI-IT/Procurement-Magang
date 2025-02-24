import express from 'express';
import { createVendor, deleteVendor, editVendor, getAllVendors, getVendorById } from '../controllers/vendorController';

const router = express.Router();

router.post('/', createVendor);
router.get('/', getAllVendors);
router.put('/:id', editVendor);
router.delete('/:id', deleteVendor);
router.get('/:id', getVendorById);

export default router;