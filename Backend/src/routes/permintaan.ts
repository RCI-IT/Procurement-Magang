import express from "express";
import { createPermintaanLapangan, getAllPermintaanLapangan, updateStatusPermintaan, deletePermintaanLapangan, getPermintaanById } from "../controllers/permintaanController";

const router = express.Router();

router.get('/:id', getPermintaanById);
router.post('/', createPermintaanLapangan);
router.get('/', getAllPermintaanLapangan);
router.put('/:id', updateStatusPermintaan);
router.delete('/:id', deletePermintaanLapangan);


export default router;