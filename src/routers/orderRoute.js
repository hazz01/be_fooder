"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const orderValidation_1 = require("../middlewares/orderValidation");
const authorization_1 = require("../middlewares/authorization");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get(`/`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["CASHIER", "MANAGER"])], orderController_1.getAllOrders);
app.post(`/`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["CASHIER"]), orderValidation_1.verifyAddOrder], orderController_1.createOrder);
app.put(`/:id`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["CASHIER"]), orderValidation_1.verifyEditStatus], orderController_1.updateStatusOrder);
app.delete(`/:id`, [authorization_1.verifyToken, (0, authorization_1.verifyRole)(["MANAGER"])], orderController_1.deleteOrder);
exports.default = app;
