"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messMemberServices = void 0;
const prisma_1 = require("../../libs/prisma");
const listMessMembers = async () => {
    const messMembers = await prisma_1.prisma.messMember.findMany({
        include: {
            user: true,
            mealRecords: true,
            deposits: true,
        },
    });
    return messMembers;
};
const getMessMemberById = async (messMemberId) => {
    const messMember = await prisma_1.prisma.messMember.findUnique({
        where: {
            userId: messMemberId,
        },
        include: {
            user: true,
            mealRecords: true,
            deposits: true,
        },
    });
    return messMember;
};
exports.messMemberServices = {
    listMessMembers,
    getMessMemberById,
};
