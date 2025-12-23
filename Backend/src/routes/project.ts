import { projectController } from "@/controllers/project/projectController";
import { rabController } from "@/controllers/project/rabController";
import { roleController } from "@/controllers/project/roleController";
import { memberController } from "@/controllers/project/memberController";
import { Router } from "express";

const router = Router();

router.post("", projectController.create);
router.get("", projectController.getAll);
router.get("/:id", projectController.getById);
router.patch("/:id", projectController.put);
router.delete("/:id", projectController.delete);

router.post("/rab", rabController.create);
router.get("/rab", rabController.getAll);

router.post("/role", roleController.create);
router.get("/role", roleController.getAll);

router.post("/employee", memberController.create);

export default router;
