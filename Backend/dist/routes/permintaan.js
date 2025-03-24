"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permintaanController_1 = require("../controllers/permintaanController");
const router = express_1.default.Router();
router.put('/:id/edit', permintaanController_1.editPermintaanLapangan);
router.put('/:id', permintaanController_1.updateStatusPermintaan);
router.get('/:id', permintaanController_1.getPermintaanById);
router.post('/', permintaanController_1.createPermintaanLapangan);
router.get('/', permintaanController_1.getAllPermintaanLapangan);
router.delete('/:id', permintaanController_1.deletePermintaanLapangan);
exports.default = router;
