import express from "express";
import {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  deletePurchaseOrder,
} from "../controllers/purchaseController";

const router = express.Router();

router.get("/", getAllPurchaseOrders);
router.get("/:id", getPurchaseOrderById);
router.delete("/:id", deletePurchaseOrder);

export default router;
    