import { Decimal } from "@prisma/client/runtime/client";
import { MealType } from "../../generated/prisma/enums";
import { prisma } from "../../libs/prisma";
import { IUpsertMealRecordPayload } from "./interfaces";

const getMealRate = (
  messMealRate: { fullMealRate: Decimal | null; halfMealRate: Decimal | null },
  mealType: MealType | undefined,
) => {
  const mealRate =
    mealType === MealType.FULL
      ? messMealRate.fullMealRate
      : messMealRate.halfMealRate;

  if (mealRate === null || mealRate === undefined) {
    throw new Error("Meal rate not found for the mess");
  }

  return mealRate;
};

const upsertSingleMealRecord = async (payload: IUpsertMealRecordPayload) => {
  const { messMemberId, mealRecordId, managerId, mealType } = payload;

  // check if the mess member exists and belongs to the same mess as the manager
  const messMember = await prisma.messMember.findUnique({
    where: { id: messMemberId },
  });

  if (!messMember) {
    throw new Error("Mess member not found");
  }

  const mess = await prisma.mess.findUnique({ where: { managerId } });
  console.log("mess", mess);
  if (!mess) {
    throw new Error("Mess not found");
  }

  if (messMember.messId !== mess.id) {
    throw new Error(
      "Mess member does not belong to the same mess as the manager",
    );
  }

  const messMealRate = await prisma.mealRate.findUnique({
    where: { messId: mess.id },
  });
  if (!messMealRate) {
    throw new Error("Meal rate not found for the mess");
  }

  // calculate the meal rate
  const mealRate = getMealRate(messMealRate, mealType);

  // upsert the meal record and update the deposit in a transaction
  return prisma.$transaction(async (tx) => {
    // deduct the meal rate from the latest deposit, or create a negative one
    const deposit = await tx.deposit.findFirst({
      where: { messMemberId },
      orderBy: { createdAt: "desc" },
    });

    if (deposit) {
      await tx.deposit.update({
        where: { id: deposit.id },
        data: { amount: { decrement: mealRate } },
      });
    } else {
      await tx.deposit.create({
        data: {
          messMemberId,
          amount: -mealRate,
          note: "Auto-generated deposit for meal record update",
        },
      });
    }

    // update the existing meal record, or create a new one
    if (mealRecordId) {
      return tx.mealRecord.update({
        where: { id: mealRecordId },
        data: { messMemberId, mealType },
      });
    }

    return tx.mealRecord.create({
      data: { messMemberId, mealType, mealRate },
    });
  });
};

export const mealRecordServices = {
  upsertSingleMealRecord,
};
