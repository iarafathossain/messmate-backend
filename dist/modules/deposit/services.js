"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositServices = void 0;
const prisma_1 = require("../../libs/prisma");
const upsertDeposit = async (payload) => {
    const { messMemberId, amount, depositDate, note, managerId } = payload;
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
    const newDeposit = await prisma_1.prisma.deposit.create({
        data: {
            messMemberId,
            amount,
            depositDate,
            note,
        },
    });
    return newDeposit;
};
exports.depositServices = {
    upsertDeposit,
};
