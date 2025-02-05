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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavourite = exports.getDashboard = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getDashboard = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** process to get order, contains means search name or table number of customer's order based on sent keyword */
        const allUsers = yield prisma.user.findMany();
        const allMenus = yield prisma.menu.findMany();
        const newOrders = yield prisma.order.findMany({
            where: {
                OR: [
                    { status: "NEW" },
                    { status: "PAID" }
                ]
            },
        });
        const doneOrders = yield prisma.order.findMany({
            where: { status: 'DONE' },
        });
        return response.json({
            status: true,
            data: {
                allUser: allUsers.length,
                allMenus: allMenus.length,
                newOrder: newOrders.length,
                doneOrder: doneOrders.length,
            },
            message: `Order list has retrieved`
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
exports.getDashboard = getDashboard;
const getFavourite = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mengambil semua order list yang ada
        const orderLists = yield prisma.orderList.findMany({
            include: {
                Menu: true, // Mengambil informasi menu
            },
        });
        // Membuat objek untuk menyimpan jumlah pemesanan per menu
        const menuCount = {};
        // Menghitung jumlah pemesanan untuk setiap menu
        orderLists.forEach(orderList => {
            var _a;
            const menuName = (_a = orderList.Menu) === null || _a === void 0 ? void 0 : _a.name; // Nama menu
            if (menuName) {
                if (!menuCount[menuName]) {
                    menuCount[menuName] = 0; // Inisialisasi jika belum ada
                }
                menuCount[menuName] += orderList.quantity; // Menambahkan jumlah pemesanan
            }
        });
        // Mengubah objek menjadi array untuk dikirim sebagai respons
        const result = Object.entries(menuCount).map(([name, count]) => ({
            name,
            count,
        }));
        return response.json({
            status: true,
            data: result,
            message: "All report menu are retrieved",
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
exports.getFavourite = getFavourite;
