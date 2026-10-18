import status from "http-status";
import AppError from "../../errors/app-error";
import { prisma } from "../../libs/prisma";
import { IMealRate } from "./interfaces";

const upsertMealRate = async (payload: IMealRate) => {
  const { managerId, fullMealRate, halfMealRate } = payload;

  // find mess and upsert meal rate through transaction
  const mealRate = await prisma.$transaction(async (prisma) => {
    // find the mess by managerId
    const mess = await prisma.mess.findUnique({
      where: {
        managerId,
      },
    });

    if (!mess) {
      throw new AppError(status.NOT_FOUND, "Mess not found");
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

export const mealRateServices = {
  upsertMealRate,
};
