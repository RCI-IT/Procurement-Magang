import { Router } from "express";
// const { validateTableName } = require("../middleware/validTable");
import { uploads } from "../utils/UploadCertification";
const SertifController = require ('../controller/certificationController')

export const Certification: Router = Router();

Certification.get("/", SertifController.getAll);
Certification.get("/:id", SertifController.getById);
Certification.post("/", uploads, SertifController.createCertificate);
Certification.put("/:id", uploads, SertifController.putCertificate);
Certification.delete("/:id", SertifController.deleteCertificate);
