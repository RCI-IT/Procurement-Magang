import express from "express";
import { createPermintaanLapangan, getAllPermintaanLapangan, updateStatusPermintaan, deletePermintaanLapangan } from "../controllers/permintaanController";

const router = express.Router();

router.post('/', createPermintaanLapangan);
router.get('/', getAllPermintaanLapangan);
router.put('/:id', updateStatusPermintaan);
router.delete('/:id', deletePermintaanLapangan);

export default router;