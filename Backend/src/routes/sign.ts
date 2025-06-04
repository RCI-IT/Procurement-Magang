import { Router } from "express";
import { generate, verify } from "../controllers/signController";
const router = Router();

router.post("/generate-qrcode", generate);
router.post("/verify-qrcode", verify);

export default router;
