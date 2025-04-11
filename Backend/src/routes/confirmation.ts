import { Router } from 'express';
import {
  createCO,
  getAllCO,
  getCOById,
  updateCO,
  deleteCO,
} from '../controllers/confirmationController';

const router = Router();

router.post('/', createCO);           // POST   /confirm        → create CO
router.get('/', getAllCO);            // GET    /confirm        → get all CO
router.get('/:id', getCOById);        // GET    /confirm/:id    → get detail CO by id
router.put('/:id', updateCO);         // PUT    /confirm/:id    → update CO
router.delete('/:id', deleteCO);      // DELETE /confirm/:id    → delete CO

export default router;
