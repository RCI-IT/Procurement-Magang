import express from 'express';
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder, // <-- pastikan ini ada
  deletePurchaseOrder
} from '../controllers/purchaseController';

const router = express.Router();

// Endpoint
router.post('/', createPurchaseOrder);
router.get('/', getAllPurchaseOrders);
router.get('/:id', getPurchaseOrderById);
router.put('/:id', updatePurchaseOrder); // <-- ini yang penting
router.delete('/:id', deletePurchaseOrder);

export default router;
