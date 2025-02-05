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
exports.deleteMenu = exports.updateMenu = exports.createMenu = exports.getAllMenus = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const global_1 = require("../global");
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllMenus = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get requested data (data has been sent from request) */
        const { search } = request.query;
        /** process to get menu, contains means search name of menu based on sent keyword */
        const allMenus = yield prisma.menu.findMany({
            where: { name: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" } }
        });
        return response.json({
            status: true,
            data: allMenus,
            message: `Menus has retrieved`
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
exports.getAllMenus = getAllMenus;
const createMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get requested data (data has been sent from request) */
        const { name, price, category, description } = request.body;
        const uuid = (0, uuid_1.v4)();
        /** variable filename use to define of uploaded file name */
        let filename = "";
        if (request.file)
            filename = request.file.filename; /** get file name of uploaded file */
        /** process to save new menu, price and stock have to convert in number type */
        const newMenu = yield prisma.menu.create({
            data: { uuid, name, price: Number(price), category, description, picture: filename }
        });
        return response.json({
            status: true,
            data: newMenu,
            message: `New Menu has created`
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
exports.createMenu = createMenu;
const updateMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get id of menu's id that sent in parameter of URL */
        const { id } = request.params;
        /** get requested data (data has been sent from request) */
        const { name, price, category, description } = request.body;
        /** make sure that data is exists in database */
        const findMenu = yield prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu)
            return response
                .status(200)
                .json({ status: false, message: `Menu is not found` });
        /** default value filename of saved data */
        let filename = findMenu.picture;
        if (request.file) {
            /** update filename by new uploaded picture */
            filename = request.file.filename;
            /** check the old picture in the folder */
            let path = `${global_1.BASE_URL}/../public/menu_picture/${findMenu.picture}`;
            let exists = fs_1.default.existsSync(path);
            /** delete the old exists picture if reupload new file */
            if (exists && findMenu.picture !== ``)
                fs_1.default.unlinkSync(path);
        }
        /** process to update menu's data */
        const updatedMenu = yield prisma.menu.update({
            data: {
                name: name || findMenu.name,
                price: price ? Number(price) : findMenu.price,
                category: category || findMenu.category,
                description: description || findMenu.description,
                picture: filename
            },
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: updatedMenu,
            message: `Menu has updated`
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
exports.updateMenu = updateMenu;
const deleteMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get id of menu's id that sent in parameter of URL */
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findMenu = yield prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu)
            return response
                .status(200)
                .json({ status: false, message: `Menu is not found` });
        /** check the old picture in the folder */
        let path = `${global_1.BASE_URL}/../public/menu_picture/${findMenu.picture}`;
        let exists = fs_1.default.existsSync(path);
        /** delete the old exists picture if reupload new file */
        if (exists && findMenu.picture !== ``)
            fs_1.default.unlinkSync(path);
        /** process to delete menu's data */
        const deletedMenu = yield prisma.menu.delete({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: deletedMenu,
            message: `Menu has deleted`
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
exports.deleteMenu = deleteMenu;
