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
exports.deleteOrder = exports.updateStatusOrder = exports.createOrder = exports.getAllOrders = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllOrders = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get requested data (data has been sent from request) */
        const { search } = request.query;
        /** process to get order, contains means search name or table number of customer's order based on sent keyword */
        const allOrders = yield prisma.order.findMany({
            where: {
                OR: [
                    { customer: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" } },
                    { table_number: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" } }
                ]
            },
            orderBy: { createdAt: "desc" }, /** sort by descending order date */
            include: {
                User: true,
                orderLists: {
                    include: { Menu: true }
                }
            }
        });
        return response.json({
            status: true,
            data: allOrders,
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
exports.getAllOrders = getAllOrders;
const createOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get requested data (data has been sent from request) */
        const { customer, table_number, payment_method, status, orderlists } = request.body;
        const user = request.body.user;
        const uuid = (0, uuid_1.v4)();
        /**
         * assume that "orderlists" is an array of object that has keys:
         * menuId, quantity, note
         * */
        /** loop details of order to check menu and count the total price */
        let total_price = 0;
        for (let index = 0; index < orderlists.length; index++) {
            const { menuId } = orderlists[index];
            const detailMenu = yield prisma.menu.findFirst({
                where: {
                    id: menuId
                }
            });
            if (!detailMenu)
                return response
                    .status(200).json({ status: false, message: `Menu with id ${menuId} is not found` });
            total_price += (detailMenu.price * orderlists[index].quantity);
        }
        /** process to save new order */
        const newOrder = yield prisma.order.create({
            data: { uuid, customer, table_number, total_price, payment_method, status, userId: user.id }
        });
        /** loop details of Order to save in database */
        for (let index = 0; index < orderlists.length; index++) {
            const uuid = (0, uuid_1.v4)();
            const { menuId, quantity, note } = orderlists[index];
            yield prisma.orderList.create({
                data: {
                    uuid, orderId: newOrder.id, menuId: Number(menuId), quantity: Number(quantity), note
                }
            });
        }
        return response.json({
            status: true,
            data: newOrder,
            message: `New Order has created`
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
exports.createOrder = createOrder;
const updateStatusOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get id of order's id that sent in parameter of URL */
        const { id } = request.params;
        /** get requested data (data has been sent from request) */
        const { status } = request.body;
        const user = request.body.user;
        /** make sure that data is exists in database */
        const findOrder = yield prisma.order.findFirst({ where: { id: Number(id) } });
        if (!findOrder)
            return response
                .status(200)
                .json({ status: false, message: `Order is not found` });
        /** process to update menu's data */
        const updatedStatus = yield prisma.order.update({
            data: {
                status: status || findOrder.status,
                userId: user.id ? user.id : findOrder.userId
            },
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: updatedStatus,
            message: `Order has updated`
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
exports.updateStatusOrder = updateStatusOrder;
const deleteOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** get id of order's id that sent in parameter of URL */
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findOrder = yield prisma.order.findFirst({ where: { id: Number(id) } });
        if (!findOrder)
            return response
                .status(200)
                .json({ status: false, message: `Order is not found` });
        /** process to delete details of order */
        let deleteOrderList = yield prisma.orderList.deleteMany({ where: { orderId: Number(id) } });
        /** process to delete of Order */
        let deleteOrder = yield prisma.order.delete({ where: { id: Number(id) } });
        return response.json({
            status: true,
            data: deleteOrder,
            message: `Order has deleted`
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
exports.deleteOrder = deleteOrder;
