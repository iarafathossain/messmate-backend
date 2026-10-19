"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRateServices = exports.getMealRate = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../errors/app-error"));
const prisma_1 = require("../../libs/prisma");
const upsertMealRate = async (payload) => {
    const { managerId, fullMealRate, halfMealRate } = payload;
    // find mess and upsert meal rate through transaction
    const mealRate = await prisma_1.prisma.$transaction(async (prisma) => {
        // find the mess by managerId
        const mess = await prisma.mess.findUnique({
            where: {
                managerId,
            },
        });
        if (!mess) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, "Mess not found");
        }
        // upsert meal rate
        const mealRate = await prisma.mealRate.upsert({
            where: {
                messId: mess.id,
            },
            update: {
                fullMealRate,
                halfMealRate,
            },
            create: {
                messId: mess.id,
                fullMealRate,
                halfMealRate,
            },
        });
        return mealRate;
    });
    return mealRate;
};
const getMealRate = async (userId) => {
    // find the mess by managerId and get the meal rate through transaction
    const mealRate = await prisma_1.prisma.$transaction(async (prisma) => {
        // find the mess by managerId
        const mess = await prisma.mess.findUnique({
            where: {
                managerId: userId,
            },
        });
        if (!mess) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, "Mess not found");
        }
        // get meal rate
        const mealRate = await prisma.mealRate.findUnique({
            where: {
                messId: mess.id,
            },
        });
        if (!mealRate) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, "Meal rate not found");
        }
        return mealRate;
    });
    return mealRate;
};
exports.getMealRate = getMealRate;
exports.mealRateServices = {
    upsertMealRate,
    getMealRate: exports.getMealRate,
};
