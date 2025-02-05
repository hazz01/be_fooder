"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.deleteUser = exports.changePicture = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const global_1 = require("../global");
const uuid_1 = require("uuid");
const md5_1 = __importDefault(require("md5"));
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllUsers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get requested data (data has been sent from request) */
        const { search } = request.query;
        /** process to get user, contains means search name of user based on sent keyword */
        const allUser = yield prisma.user.findMany({
            where: { name: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" } }
        });
        return response.json({
            status: true,
            data: allUser,
            message: `user has retrieved`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get requested data (data has been sent from request) */
        const { id } = request.body.user;
        if (!id) {
            return response
                .json({
                status: false,
                message: `User Not Found`
            })
                .status(400);
        }
        /** process to get user, contains means search name of user based on sent keyword */
        const allUser = yield prisma.user.findFirst({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: allUser,
            message: `user has retrieved`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.getUserById = getUserById;
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get requested data (data has been sent from request) */
        const { name, email, password, role } = request.body;
        const uuid = (0, uuid_1.v4)();
        /** variable filename use to define of uploaded file name */
        let filename = "";
        if (request.file)
            filename = request.file.filename; /** get file name of uploaded file */
        /** process to save new user */
        const newUser = yield prisma.user.create({
            data: { uuid, name, email, password: (0, md5_1.default)(password), role, profile_picture: filename }
        });
        return response.json({
            status: true,
            data: newUser,
            message: `New user has created`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.createUser = createUser;
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get id of user's id that sent in parameter of URL */
        const { id } = request.params;
        /** get requested data (data has been sent from request) */
        const { name, email, password, role } = request.body;
        /** make sure that data is exists in database */
        const findUser = yield prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, message: `user is not found` });
        /** default value filename of saved data */
        let filename = findUser.profile_picture;
        if (request.file) {
            /** update filename by new uploaded picture */
            filename = request.file.filename;
            /** check the old picture in the folder */
            let path = `${global_1.BASE_URL}/../public/profile_picture/${findUser.profile_picture}`;
            let exists = fs_1.default.existsSync(path);
            /** delete the old exists picture if reupload new file */
            if (exists && findUser.profile_picture !== ``)
                fs_1.default.unlinkSync(path);
        }
        /** process to update user's data */
        const updatedUser = yield prisma.user.update({
            data: {
                name: name || findUser.name,
                email: email || findUser.email,
                password: password ? (0, md5_1.default)(password) : findUser.password,
                role: role || findUser.role,
                profile_picture: filename
            },
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: updatedUser,
            message: `user has updated`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.updateUser = updateUser;
const changePicture = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get id of menu's id that sent in parameter of URL */
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findUser = yield prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, message: `User is not found` });
        /** default value filename of saved data */
        let filename = findUser.profile_picture;
        if (request.file) {
            /** update filename by new uploaded picture */
            filename = request.file.filename;
            /** check the old picture in the folder */
            let path = `${global_1.BASE_URL}/../public/profile_picture/${findUser.profile_picture}`;
            let exists = fs_1.default.existsSync(path);
            /** delete the old exists picture if reupload new file */
            if (exists && findUser.profile_picture !== ``)
                fs_1.default.unlinkSync(path);
        }
        /** process to update picture in database */
        const updatePicture = yield prisma.user.update({
            data: { profile_picture: filename },
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: updatePicture,
            message: `Picture has changed`
        }).status(200);
    }
    catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400);
    }
});
exports.changePicture = changePicture;
const deleteUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get id of user's id that sent in parameter of URL */
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findUser = yield prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, message: `user is not found` });
        /** prepare to delete file of deleted user's data */
        let path = `${global_1.BASE_URL}/public/profile_picture/${findUser.profile_picture}`; /** define path (address) of file location */
        let exists = fs_1.default.existsSync(path);
        if (exists && findUser.profile_picture !== ``)
            fs_1.default.unlinkSync(path); /** if file exist, then will be delete */
        /** process to delete user's data */
        const deleteduser = yield prisma.user.delete({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: deleteduser,
            message: `user has deleted`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.deleteUser = deleteUser;
const authentication = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body; /** get requested data (data has been sent from request) */
        /** find a valid admin based on username and password */
        const findUser = yield prisma.user.findFirst({
            where: { email, password: (0, md5_1.default)(password) }
        });
        /** check is admin exists */
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, logged: false, message: `Email or password is invalid` });
        let data = {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role
        };
        /** define payload to generate token */
        let payload = JSON.stringify(data);
        /** generate token */
        let token = (0, jsonwebtoken_1.sign)(payload, global_1.SECRET || "joss");
        return response
            .status(200)
            .json({ status: true, logged: true, data: data, message: `Login Success`, token });
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.authentication = authentication;
