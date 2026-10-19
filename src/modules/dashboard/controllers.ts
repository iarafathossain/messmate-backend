import { Request, Response } from "express";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { getAuthUser } from "../../utils/get-auth-user";
import { dashboardServices } from "./services";

const getMonthlySheet = catchAsync(async (req: Request, res: Response) => {
  const { userId } = getAuthUser(req);
  const year = Number(req.query.year);
  const month = Number(req.query.month);
  const data = await dashboardServices.getMonthlySheet(userId, year, month);
  sendResponse(res, { httpStatusCode: 200, success: true, message: "Monthly sheet fetched successfully", data });
});

const getMealSheet = catchAsync(async (req: Request, res: Response) => {
  const { userId } = getAuthUser(req);
  const data = await dashboardServices.getMealSheet(userId);
  sendResponse(res, { httpStatusCode: 200, success: true, message: "Meal sheet fetched successfully", data });
});

export const dashboardControllers = { getMonthlySheet, getMealSheet };
