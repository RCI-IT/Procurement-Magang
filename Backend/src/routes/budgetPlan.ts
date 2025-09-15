import { Router } from "express";
import { budgetController } from "../controllers/budgetController"; 

export const Budget: Router = Router();

Budget.post('/', budgetController.create);
Budget.get('/:projectId', budgetController.getByProject);
// Budget.get('/:id', budgetController.getById);
// Budget.put('/:id', budgetController.put);