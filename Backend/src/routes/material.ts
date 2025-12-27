import { imageController } from "@/controllers/material/material-imageController";
import { materialController } from "@/controllers/material/materialController";
import { Router } from "express";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { files: 5 }, // max 5 foto
});

router.get("/", materialController.getAll);
router.get("/:id", materialController.getById);

// 🔥 multiple photos
router.post("/", upload.array("images", 5), materialController.create);
router.post("/:id/images", upload.array("images", 5), imageController.addImages)
router.put("/images/:imageId", upload.single("image"), imageController.replaceImage)
router.put("/:id", upload.array("images", 5), materialController.edit);

router.delete("/images/:imageId", imageController.deleteImage)
router.delete("/:id", materialController.delete);

export default router