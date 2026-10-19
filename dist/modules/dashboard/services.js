"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../errors/app-error"));
const prisma_1 = require("../../libs/prisma");
const getMessForUser = async (userId) => {
    const managerMess = await prisma_1.prisma.mess.findUnique({ where: { managerId: userId } });
    if (managerMess)
        return managerMess;
    const membership = await prisma_1.prisma.messMember.findUnique({ where: { userId } });
    if (!membership)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, "Mess membership not found");
    const mess = await prisma_1.prisma.mess.findUnique({ where: { id: membership.messId } });
    if (!mess)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, "Mess not found");
    return mess;
};
const getMonthlySheet = async (userId, year, month) => {
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, "A valid year and month are required");
    }
    const mess = await getMessForUser(userId);
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    const [members, expenses, mealRate] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.messMember.findMany({
            where: { messId: mess.id },
            include: {
                user: { select: { name: true, phone: true } },
                deposits: { orderBy: { createdAt: "desc" } },
                mealRecords: { where: { mealDate: { gte: start, lt: end } } },
            },
            orderBy: { joinedAt: "asc" },
        }),
        prisma_1.prisma.expense.findMany({
            where: { messId: mess.id, createdAt: { gte: start, lt: end } },
            orderBy: { createdAt: "asc" },
        }),
        prisma_1.prisma.mealRate.findUnique({ where: { messId: mess.id } }),
    ]);
    return {
        mess: { id: mess.id, name: mess.messName, code: mess.messCode },
        year,
        month,
        mealRate,
        members,
        expenses,
        totals: {
            revenue: members.reduce((sum, member) => sum + member.deposits.reduce((s, d) => s + Number(d.amount), 0), 0),
            expenses: expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
        },
    };
};
const getMealSheet = async (userId) => {
    const mess = await getMessForUser(userId);
    const [members, expenses, mealRate] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.messMember.findMany({
            where: { messId: mess.id },
            include: {
                user: { select: { name: true, phone: true } },
                deposits: { orderBy: { createdAt: "desc" } },
                mealRecords: { orderBy: { mealDate: "desc" }, take: 1 },
            },
            orderBy: { joinedAt: "asc" },
        }),
        prisma_1.prisma.expense.findMany({ where: { messId: mess.id }, orderBy: { createdAt: "desc" } }),
        prisma_1.prisma.mealRate.findUnique({ where: { messId: mess.id } }),
    ]);
    return {
        mess: { id: mess.id, name: mess.messName, code: mess.messCode },
        mealRate,
        members,
        expenses,
        totals: {
            revenue: members.reduce((sum, member) => sum + member.deposits.reduce((s, d) => s + Number(d.amount), 0), 0),
            expenses: expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
        },
    };
};
exports.dashboardServices = { getMonthlySheet, getMealSheet, getMessForUser };
