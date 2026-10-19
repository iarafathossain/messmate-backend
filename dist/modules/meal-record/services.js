"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRecordServices = void 0;
const enums_1 = require("../../generated/prisma/enums");
const prisma_1 = require("../../libs/prisma");
const getMealRate = (messMealRate, mealType) => {
    const mealRate = mealType === enums_1.MealType.FULL
        ? messMealRate.fullMealRate
        : messMealRate.halfMealRate;
    if (mealRate === null || mealRate === undefined) {
        throw new Error("Meal rate not found for the mess");
    }
    return mealRate;
};
const upsertSingleMealRecord = async (payload) => {
    const { messMemberId, mealRecordId, managerId, mealType, mealDate, mealRate: requestedRate } = payload;
    // check if the mess member exists and belongs to the same mess as the manager
    const messMember = await prisma_1.prisma.messMember.findUnique({
        where: { id: messMemberId },
    });
    if (!messMember) {
        throw new Error("Mess member not found");
    }
    const mess = await prisma_1.prisma.mess.findUnique({ where: { managerId } });
    if (!mess) {
        throw new Error("Mess not found");
    }
    if (messMember.messId !== mess.id) {
        throw new Error("Mess member does not belong to the same mess as the manager");
    }
    const messMealRate = await prisma_1.prisma.mealRate.findUnique({
        where: { messId: mess.id },
    });
    if (!messMealRate) {
        throw new Error("Meal rate not found for the mess");
    }
    // calculate the meal rate
    const mealRate = requestedRate ?? getMealRate(messMealRate, mealType);
    const data = { messMemberId, mealType, mealRate, mealDate: new Date(`${mealDate}T00:00:00.000Z`) };
    if (mealRecordId) {
        return prisma_1.prisma.mealRecord.update({ where: { id: mealRecordId }, data });
    }
    return prisma_1.prisma.mealRecord.upsert({
        where: { messMemberId_mealDate: { messMemberId, mealDate: data.mealDate } },
        update: { mealType, mealRate, mealDate: data.mealDate },
        create: data,
    });
};
exports.mealRecordServices = {
    upsertSingleMealRecord,
};
