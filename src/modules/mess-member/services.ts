import { prisma } from "../../libs/prisma";

const listMessMembers = async () => {
  const messMembers = await prisma.messMember.findMany({
    include: {
      user: true,
      mealRecords: true,
      deposits: true,
    },
  });

  return messMembers;
};

const getMessMemberById = async (messMemberId: string) => {
  const messMember = await prisma.messMember.findUnique({
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

export const messMemberServices = {
  listMessMembers,
  getMessMemberById,
};
