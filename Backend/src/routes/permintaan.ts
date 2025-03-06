import express from "express";
import { 
  createPermintaanLapangan,
  editPermintaanLapangan,
  getAllPermintaanLapangan,
  updateStatusPermintaan,
  deletePermintaanLapangan,
  getPermintaanById
} from "../controllers/permintaanController";

const router = express.Router();

router.put('/:id/edit', editPermintaanLapangan);
router.put('/:id', updateStatusPermintaan); 

router.get('/:id', getPermintaanById);
router.post('/', createPermintaanLapangan);
router.get('/', getAllPermintaanLapangan);
router.delete('/:id', deletePermintaanLapangan);

export default router;
