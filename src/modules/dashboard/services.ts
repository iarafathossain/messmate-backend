import status from "http-status";
import AppError from "../../errors/app-error";
import { prisma } from "../../libs/prisma";

const getMessForUser = async (userId: string) => {
  const managerMess = await prisma.mess.findUnique({ where: { managerId: userId } });
  if (managerMess) return managerMess;
  const membership = await prisma.messMember.findUnique({ where: { userId } });
  if (!membership) throw new AppError(status.NOT_FOUND, "Mess membership not found");
  const mess = await prisma.mess.findUnique({ where: { id: membership.messId } });
  if (!mess) throw new AppError(status.NOT_FOUND, "Mess not found");
  return mess;
};

const getMonthlySheet = async (userId: string, year: number, month: number) => {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new AppError(status.BAD_REQUEST, "A valid year and month are required");
  }
  const mess = await getMessForUser(userId);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  const [members, expenses, mealRate] = await prisma.$transaction([
    prisma.messMember.findMany({
      where: { messId: mess.id },
      include: {
        user: { select: { name: true, phone: true } },
        deposits: { orderBy: { createdAt: "desc" } },
        mealRecords: { where: { mealDate: { gte: start, lt: end } } },
      },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.expense.findMany({
      where: { messId: mess.id, createdAt: { gte: start, lt: end } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.mealRate.findUnique({ where: { messId: mess.id } }),
  ]);
  return {
    mess: { id: mess.id, name: mess.messName, code: mess.messCode },
    year,
    month,
    mealRate,
    members,
    expenses,
    totals: {
      revenue: members.reduce((sum, member) => sum + member.deposits.reduce((s, d) => s + Number(d.amount), 0), 0),
      expenses:
        expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) +
        members.reduce(
          (sum, member) =>
            sum +
            member.mealRecords.reduce((mealSum, meal) => mealSum + Number(meal.mealRate), 0),
          0,
        ),
    },
  };
};

const getMealSheet = async (userId: string) => {
  const mess = await getMessForUser(userId);
  const [members, expenses, mealRate] = await prisma.$transaction([
    prisma.messMember.findMany({
      where: { messId: mess.id },
      include: {
        user: { select: { name: true, phone: true } },
        deposits: { orderBy: { createdAt: "desc" } },
        mealRecords: { orderBy: { mealDate: "desc" }, take: 1 },
      },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.expense.findMany({ where: { messId: mess.id }, orderBy: { createdAt: "desc" } }),
    prisma.mealRate.findUnique({ where: { messId: mess.id } }),
  ]);
  return {
    mess: { id: mess.id, name: mess.messName, code: mess.messCode },
    mealRate,
    members,
    expenses,
    totals: {
      revenue: members.reduce((sum, member) => sum + member.deposits.reduce((s, d) => s + Number(d.amount), 0), 0),
      expenses:
        expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) +
        members.reduce(
          (sum, member) =>
            sum +
            member.mealRecords.reduce((mealSum, meal) => mealSum + Number(meal.mealRate), 0),
          0,
        ),
    },
  };
};

export const dashboardServices = { getMonthlySheet, getMealSheet, getMessForUser };
