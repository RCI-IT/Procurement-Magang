import { Router } from "express";
import { generateSignature, getSigningStatus, verify } from "../controllers/signController";
const router = Router();

router.post("/", generateSignature);
router.get("/:fileType/:relatedId", getSigningStatus)
router.post("/verify-qrcode", verify);

export default router;
