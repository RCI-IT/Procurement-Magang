// routes/auth.routes.ts
import { Router } from "express";
import { login, logout } from "../controllers/auth-services/authController";
import { refreshToken } from "../controllers/auth-services/refreshController"

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
