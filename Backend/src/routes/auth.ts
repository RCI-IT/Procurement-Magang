// src/routes/auth.ts

import { Router } from "express";
import { login } from "../controllers/authControllers";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// router.post("/register", register);
router.post("/login", login);
// router.post("/logout", logout);
// router.get("/profile", authMiddleware, profile);
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: `Welcome, ${
      (req as any).user && ((req as any).user as any).username
    }`,
  });
});

export default router;
