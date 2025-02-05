"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controllers/reportController");
const authorization_1 = require("../middlewares/authorization");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get(`/dashboard`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["CASHIER", "MANAGER"])], reportController_1.getDashboard);
app.get(`/favorite`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["CASHIER", "MANAGER"])], reportController_1.getFavourite);
exports.default = app;
