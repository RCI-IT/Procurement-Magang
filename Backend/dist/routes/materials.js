"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const materialController_1 = require("../controllers/materialController");
const materialController_2 = require("../controllers/materialController");
const materialController_3 = require("../controllers/materialController");
const materialController_4 = require("../controllers/materialController");
const materialController_5 = require("../controllers/materialController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.get('/:id', materialController_5.getMaterialById);
router.get('/', materialController_2.getAllMaterials);
router.post('/', upload.single('image'), materialController_1.createMaterial);
router.delete('/:id', materialController_3.deleteMaterial);
router.put('/:id', upload.single('image'), materialController_4.editMaterial);
exports.default = router;
