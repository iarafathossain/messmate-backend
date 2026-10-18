import { prisma } from "../../libs/prisma";
import { IUpsertDepositPayload } from "./interfaces";

const upsertDeposit = async (payload: IUpsertDepositPayload) => {
  const { messMemberId, amount, note } = payload;

  // check if the mess member exists
  const messMember = await prisma.messMember.findUnique({
    where: { id: messMemberId },
  });

  if (!messMember) {
    throw new Error("Mess member not found");
  }

  // if deposit exists, update the existing deposit
  const existingDeposit = await prisma.deposit.findFirst({
    where: { messMemberId },
    orderBy: { createdAt: "desc" },
  });

  if (existingDeposit) {
    const updatedDeposit = await prisma.deposit.update({
      where: { id: existingDeposit.id },
      data: {
        amount,
        note,
      },
    });
    return updatedDeposit;
  }

  // create a new deposit
  const newDeposit = await prisma.deposit.create({
    data: {
      messMemberId,
      amount,
      note,
    },
  });

  return newDeposit;
};

export const depositServices = {
  upsertDeposit,
};
