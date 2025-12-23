// routes/auth.routes.ts
import { Router } from "express";
import { login, logout, updateRole } from "../controllers/auth-services/authController";
import { refreshToken } from "../controllers/auth-services/refreshController"
import { verifyToken } from "@/controllers/auth-services/authVerify.controller";
import { userController } from "@/controllers/auth-services/userController";
import { roleController } from "@/controllers/auth-services/roleController";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/logout", logout);

router.put("/updateRole/:userId", updateRole)
router.get("/verify", verifyToken);

router.post("/user", userController.create)
router.get("/user", userController.getAll)
router.get("/user/:id", userController.getById)
router.put("/user/:id", userController.put)
router.delete("/user/:id", userController.delete)
router.post("/role", roleController.create)
router.get("/role", roleController.getAll)
router.put("/role/:id", roleController.edit)
router.delete("/role/:id", roleController.delete)

export default router;
