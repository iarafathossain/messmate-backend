"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositServices = void 0;
const prisma_1 = require("../../libs/prisma");
const upsertDeposit = async (payload) => {
    const { messMemberId, amount, note, managerId } = payload;
    // check if the mess member exists
    const messMember = await prisma_1.prisma.messMember.findUnique({
        where: { id: messMemberId },
    });
    if (!messMember) {
        throw new Error("Mess member not found");
    }
    if (managerId) {
        const mess = await prisma_1.prisma.mess.findUnique({ where: { managerId } });
        if (!mess || mess.id !== messMember.messId)
            throw new Error("Member does not belong to your mess");
    }
    // if deposit exists, update the existing deposit
    const existingDeposit = await prisma_1.prisma.deposit.findFirst({
        where: { messMemberId },
        orderBy: { createdAt: "desc" },
    });
    if (existingDeposit) {
        const updatedDeposit = await prisma_1.prisma.deposit.update({
            where: { id: existingDeposit.id },
            data: {
                amount,
                note,
            },
        });
        return updatedDeposit;
    }
    // create a new deposit
    const newDeposit = await prisma_1.prisma.deposit.create({
        data: {
            messMemberId,
            amount,
            note,
        },
    });
    return newDeposit;
};
exports.depositServices = {
    upsertDeposit,
};
