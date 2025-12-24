import { projectController } from "@/controllers/project/projectController";
import { rabController } from "@/controllers/project/rabController";
import { roleController } from "@/controllers/project/roleController";
import { memberController } from "@/controllers/project/memberController";
import { Router } from "express";

const router = Router();

/**
 * =========================
 * SUB RESOURCES (STATIC)
 * =========================
 */
router.post("/rab", rabController.create);
router.get("/rab", rabController.getAll);
router.get("/rab/:id", rabController.getById);

router.post("/role", roleController.create);
router.get("/role", roleController.getAll);
router.patch("/role/:id", roleController.edit);
router.delete("/role/:id", roleController.delete);

router.post("/employee", memberController.create);
router.get("/employee", memberController.getAll);
router.get("/employee/:id", memberController.getById);
router.patch("/employee/:id", memberController.put);
router.delete("/employee/:id", memberController.delete);

/**
 * =========================
 * PROJECT (MAIN RESOURCE)
 * =========================
 */
router.post("/", projectController.create);
router.get("/", projectController.getAll);
router.get("/:id", projectController.getById);
router.patch("/:id", projectController.put);
router.delete("/:id", projectController.delete);

export default router;
