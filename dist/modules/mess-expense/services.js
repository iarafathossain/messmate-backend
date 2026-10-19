"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messExpenseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../errors/app-error"));
const prisma_1 = require("../../libs/prisma");
const upsertExpense = async (payload) => {
    // destructure the payload
    const { expenseId, messId, description, amount, managerId } = payload;
    const mess = await prisma_1.prisma.mess.findUnique({ where: { managerId } });
    if (!mess || mess.id !== messId) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, "Expense does not belong to your mess");
    }
    // check if expenseId is provided
    if (expenseId) {
        // update the expense
        const updatedExpense = await prisma_1.prisma.expense.update({
            where: { id: expenseId },
            data: { messId, description, amount },
        });
        return updatedExpense;
    }
    else {
        // create a new expense
        const newExpense = await prisma_1.prisma.expense.create({
            data: { messId, description, amount },
        });
        return newExpense;
    }
};
const listExpenses = async (messId) => prisma_1.prisma.expense.findMany({ where: { messId }, orderBy: { createdAt: "desc" } });
exports.messExpenseServices = { upsertExpense, listExpenses };
