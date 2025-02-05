"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditMenu = exports.verifyAddMenu = void 0;
const joi_1 = __importDefault(require("joi"));
/** create schema when add new menu's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    price: joi_1.default.number().min(0).required(),
    category: joi_1.default.string().valid('FOOD', 'DRINK', 'SNACK').uppercase().required(),
    description: joi_1.default.string().required(),
    picture: joi_1.default.allow().optional(),
    user: joi_1.default.optional()
});
/** create schema when edit new menu's data, all of fileds have to be required */
const editDataSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    price: joi_1.default.number().min(0).optional(),
    category: joi_1.default.string().valid('FOOD', 'DRINK', 'SNACK').uppercase().optional(),
    description: joi_1.default.string().optional(),
    picture: joi_1.default.allow().optional(),
    user: joi_1.default.optional()
});
const verifyAddMenu = (request, response, next) => {
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
exports.verifyAddMenu = verifyAddMenu;
const verifyEditMenu = (request, response, next) => {
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
exports.verifyEditMenu = verifyEditMenu;
