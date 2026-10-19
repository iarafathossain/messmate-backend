"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messExpenseControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = require("../../shared/catch-async");
const send_response_1 = require("../../shared/send-response");
const get_auth_user_1 = require("../../utils/get-auth-user");
const services_1 = require("../dashboard/services");
const services_2 = require("./services");
const upsertExpense = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { userId } = (0, get_auth_user_1.getAuthUser)(req);
    const result = await services_2.messExpenseServices.upsertExpense({ ...req.body, managerId: userId });
    (0, send_response_1.sendResponse)(res, { httpStatusCode: http_status_1.default.CREATED, success: true, message: "Expense saved successfully", data: result });
});
const listExpenses = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { userId } = (0, get_auth_user_1.getAuthUser)(req);
    const mess = await services_1.dashboardServices.getMessForUser(userId);
    const result = await services_2.messExpenseServices.listExpenses(mess.id);
    (0, send_response_1.sendResponse)(res, { httpStatusCode: 200, success: true, message: "Expenses fetched successfully", data: result });
});
exports.messExpenseControllers = { upsertExpense, listExpenses };
