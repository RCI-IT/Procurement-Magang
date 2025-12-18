import { projectController } from "@/controllers/project/projectController";
import { rabController } from "@/controllers/project/rabController";
import { Router } from "express";

const router = Router();

router.post("/project", projectController.create)
router.get("/project", projectController.getAll)
router.get("/project/:id", projectController.getById)
router.put("/project/:id", projectController.put)
router.delete("/project/:id", projectController.delete)

router.post("/rab", rabController.create)
router.get("/rab", rabController.getAll)

export default router;