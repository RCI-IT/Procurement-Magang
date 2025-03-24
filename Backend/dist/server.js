"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
app_1.default.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
