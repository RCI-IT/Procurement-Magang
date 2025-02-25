import express from 'express';
import multer from 'multer';
import { createMaterial } from '../controllers/materialController';
import { getAllMaterials } from '../controllers/materialController';
import { deleteMaterial } from '../controllers/materialController';
import { editMaterial } from '../controllers/materialController';
import { getMaterialById } from '../controllers/materialController';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/:id', getMaterialById);
router.get('/', getAllMaterials);
router.post('/', upload.single('image'), createMaterial);
router.delete('/:id', deleteMaterial);
router.put('/:id', upload.single('image'), editMaterial);

export default router;