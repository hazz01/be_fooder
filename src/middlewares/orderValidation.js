"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditStatus = exports.verifyAddOrder = void 0;
const joi_1 = __importDefault(require("joi"));
/** create schema for detail of orderlist */
const orderListSchema = joi_1.default.object({
    menuId: joi_1.default.number().required(),
    quantity: joi_1.default.number().required(),
    note: joi_1.default.string().optional(),
});
/** create schema when add new order's data */
const addDataSchema = joi_1.default.object({
    customer: joi_1.default.string().required(),
    table_number: joi_1.default.number().min(0).required(),
    payment_method: joi_1.default.string().valid("CASH", "QRIS").uppercase().required(),
    status: joi_1.default.string().valid("NEW", "PAID", "DONE").uppercase().required(),
    userId: joi_1.default.number().optional(),
    orderlists: joi_1.default.array().items(orderListSchema).min(1).required(),
    user: joi_1.default.optional()
});
/** create schema when edit status order's data */
const editDataSchema = joi_1.default.object({
    status: joi_1.default.string().valid("NEW", "PAID", "DONE").uppercase().required(),
    user: joi_1.default.optional()
});
const verifyAddOrder = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAddOrder = verifyAddOrder;
const verifyEditStatus = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = editDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyEditStatus = verifyEditStatus;
