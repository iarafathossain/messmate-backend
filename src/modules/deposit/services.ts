import { prisma } from "../../libs/prisma";
import { IUpsertDepositPayload } from "./interfaces";

const upsertDeposit = async (payload: IUpsertDepositPayload) => {
  const { messMemberId, amount, depositDate, note, managerId } = payload;

  // check if the mess member exists
  const messMember = await prisma.messMember.findUnique({
    where: { id: messMemberId },
  });

  if (!messMember) {
    throw new Error("Mess member not found");
  }
  if (managerId) {
    const mess = await prisma.mess.findUnique({ where: { managerId } });
    if (!mess || mess.id !== messMember.messId) throw new Error("Member does not belong to your mess");
  }

  const newDeposit = await prisma.deposit.create({
    data: {
      messMemberId,
      amount,
      depositDate,
      note,
    },
  });

  return newDeposit;
};

export const depositServices = {
  upsertDeposit,
};
