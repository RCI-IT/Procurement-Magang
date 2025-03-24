"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendorController_1 = require("../controllers/vendorController");
const router = express_1.default.Router();
router.post('/', vendorController_1.createVendor);
router.get('/', vendorController_1.getAllVendors);
router.put('/:id', vendorController_1.editVendor);
router.delete('/:id', vendorController_1.deleteVendor);
router.get('/:id', vendorController_1.getVendorById);
exports.default = router;
