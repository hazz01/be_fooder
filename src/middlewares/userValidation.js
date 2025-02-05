"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthentication = exports.verifyEditUser = exports.verifyAddUser = void 0;
const joi_1 = __importDefault(require("joi"));
/** create schema when add new menu's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).alphanum().required(),
    role: joi_1.default.string().valid('MANAGER', 'CASHIER').uppercase().required(),
    profile_picture: joi_1.default.allow().optional(),
    user: joi_1.default.optional()
});
/** create schema when edit new menu's data, all of fileds have to be required */
const editDataSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    email: joi_1.default.string().optional(),
    password: joi_1.default.string().optional(),
    role: joi_1.default.string().valid('MANAGER', 'CASHIER').uppercase().optional(),
    profile_picture: joi_1.default.allow().optional(),
    user: joi_1.default.optional()
});
/** create schema when authentication */
const authSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).alphanum().required(),
});
const verifyAddUser = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(200).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAddUser = verifyAddUser;
const verifyEditUser = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = editDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(200).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyEditUser = verifyEditUser;
const verifyAuthentication = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = authSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(200).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAuthentication = verifyAuthentication;
