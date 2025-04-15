import express from "express";
import { RequestHandler } from "express";
import {
  createConfirmationOrder, getAllConfirmationOrders, getConfirmationOrderById, updateConfirmationOrder, deleteConfirmationOrder,
} from "../controllers/confirmationcontroller";

const router = express.Router();

router.post("/", createConfirmationOrder as RequestHandler);
router.get("/", getAllConfirmationOrders as RequestHandler);
router.get("/:id", getConfirmationOrderById as RequestHandler);
router.put("/:id", updateConfirmationOrder as RequestHandler);
router.delete("/:id", deleteConfirmationOrder as RequestHandler);

export default router;
