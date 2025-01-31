import express from 'express';
import multer from 'multer';
import { createMaterial } from '../controllers/materialController';
import { getAllMaterials } from '../controllers/materialController';

const router = express.Router();
// Endpoint GET untuk mengambil semua material
router.get('/', getAllMaterials);

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), createMaterial);

export default router;
