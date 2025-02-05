"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menuController_1 = require("../controllers/menuController");
const menuValidation_1 = require("../middlewares/menuValidation");
const authorization_1 = require("../middlewares/authorization");
const menuUpload_1 = __importDefault(require("../middlewares/menuUpload"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get(`/`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["CASHIER", "MANAGER"])], menuController_1.getAllMenus);
app.post(`/`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["MANAGER"]), menuUpload_1.default.single("picture"), menuValidation_1.verifyAddMenu], menuController_1.createMenu);
app.put(`/:id`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["MANAGER"]), menuUpload_1.default.single("picture"), menuValidation_1.verifyEditMenu], menuController_1.updateMenu);
app.delete(`/:id`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["MANAGER"])], menuController_1.deleteMenu);
exports.default = app;
