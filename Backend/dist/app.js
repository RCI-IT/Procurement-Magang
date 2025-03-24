"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const permintaan_1 = __importDefault(require("./routes/permintaan"));
const vendors_1 = __importDefault(require("./routes/vendors"));
const materials_1 = __importDefault(require("./routes/materials"));
const categories_1 = __importDefault(require("./routes/categories"));
const users_1 = __importDefault(require("./routes/users"));
const purchase_1 = __importDefault(require("./routes/purchase"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};
app.use((0, cors_1.default)(corsOptions));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "..", "uploads")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/permintaan", permintaan_1.default);
app.use("/vendors", vendors_1.default);
app.use("/materials", materials_1.default);
app.use("/categories", categories_1.default);
app.use("/users", users_1.default);
app.use("/purchase", purchase_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
    next();
});
exports.default = app;
