import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { getAuthUser } from "../../utils/get-auth-user";
import { dashboardServices } from "../dashboard/services";
import { messExpenseServices } from "./services";

const upsertExpense = catchAsync(async (req: Request, res: Response) => {
  const { userId } = getAuthUser(req);
  const result = await messExpenseServices.upsertExpense({ ...req.body, managerId: userId });
  sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: "Expense saved successfully", data: result });
});

const listExpenses = catchAsync(async (req: Request, res: Response) => {
  const { userId } = getAuthUser(req);
  const mess = await dashboardServices.getMessForUser(userId);
  const result = await messExpenseServices.listExpenses(mess.id);
  sendResponse(res, { httpStatusCode: 200, success: true, message: "Expenses fetched successfully", data: result });
});

export const messExpenseControllers = { upsertExpense, listExpenses };
