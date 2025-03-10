import express from "express";
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
} from "../controllers/purchasecontroller";

const router = express.Router();

router.post("/", createPurchaseOrder); // ✅ Membuat Purchase Order baru
router.get("/", getAllPurchaseOrders); // ✅ Mendapatkan semua Purchase Order
router.get("/:id", getPurchaseOrderById); // ✅ Mendapatkan Purchase Order berdasarkan ID
router.put("/:id/status", updatePurchaseOrderStatus); // ✅ Mengupdate status Purchase Order
router.delete("/:id", deletePurchaseOrder); // ✅ Menghapus Purchase Order

export default router;
