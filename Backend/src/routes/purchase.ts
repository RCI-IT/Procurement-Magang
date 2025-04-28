import express from "express";
import {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  deletePurchaseOrder,
} from "../controllers/purchaseController";

const router = express.Router();

router.get("/", getAllPurchaseOrders);      // GET semua purchase
router.get("/:id", getPurchaseOrderById);    // GET berdasarkan ID
router.delete("/:id", deletePurchaseOrder);  // DELETE berdasarkan ID

export default router;
    