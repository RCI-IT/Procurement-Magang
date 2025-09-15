import { Router } from "express";
import { projectController } from "../controllers/projectControllers";

export const Project: Router = Router();

Project.post('/', projectController.create);
Project.get('/', projectController.getAll);
Project.get('/:id', projectController.getById);
Project.put('/:id', projectController.put);