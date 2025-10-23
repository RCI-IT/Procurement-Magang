import { Router } from "express";
import { budgetController } from "../controllers/budgetController"; 

export const Budget: Router = Router();

Budget.post('/', budgetController.create);
Budget.get('/:projectId', budgetController.getByProject);
Budget.put('/:id', budgetController.update);
// Budget.get('/:id', budgetController.getById);