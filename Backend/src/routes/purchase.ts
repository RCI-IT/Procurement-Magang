import express from "express";
import { RequestHandler } from "express";
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../controllers/purchasecontroller";

const router = express.Router();

router.post("/", createPurchaseOrder as RequestHandler);
router.get("/", getAllPurchaseOrders as RequestHandler);
router.get("/:id", getPurchaseOrderById as RequestHandler);
router.put("/:id", updatePurchaseOrder as RequestHandler);
router.delete("/:id", deletePurchaseOrder as RequestHandler);

export default router;
