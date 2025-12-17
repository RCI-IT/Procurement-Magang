// routes/auth.routes.ts
import { Router } from "express";
import { login, logout } from "../controllers/auth-services/authController";
import { refreshToken } from "../controllers/auth-services/refreshController"
import { verifyToken } from "@/controllers/auth-services/authVerify.controller";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/logout", logout);
router.get("/verify", verifyToken);

export default router;
