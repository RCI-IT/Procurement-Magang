"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchasecontroller_1 = require("../controllers/purchasecontroller");
const router = express_1.default.Router();
router.post("/", purchasecontroller_1.createPurchaseOrder);
router.get("/", purchasecontroller_1.getAllPurchaseOrders);
router.get("/:id", purchasecontroller_1.getPurchaseOrderById);
router.put("/:id", purchasecontroller_1.updatePurchaseOrder);
router.delete("/:id", purchasecontroller_1.deletePurchaseOrder);
exports.default = router;
