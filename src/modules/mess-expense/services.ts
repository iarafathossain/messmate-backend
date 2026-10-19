import status from "http-status";
import AppError from "../../errors/app-error";
import { prisma } from "../../libs/prisma";
import { IUpsertExpensePayload } from "./interfaces";

const upsertExpense = async (payload: IUpsertExpensePayload) => {
  // destructure the payload
  const { expenseId, messId, description, amount, managerId } = payload;
  const mess = await prisma.mess.findUnique({ where: { managerId } });
  if (!mess || mess.id !== messId) {
    throw new AppError(status.FORBIDDEN, "Expense does not belong to your mess");
  }

  // check if expenseId is provided
  if (expenseId) {
    // update the expense
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: { messId, description, amount },
    });
    return updatedExpense;
  } else {
    // create a new expense
    const newExpense = await prisma.expense.create({
      data: { messId, description, amount },
    });
    return newExpense;
  }
};

const listExpenses = async (messId: string) =>
  prisma.expense.findMany({ where: { messId }, orderBy: { createdAt: "desc" } });

export const messExpenseServices = { upsertExpense, listExpenses };
