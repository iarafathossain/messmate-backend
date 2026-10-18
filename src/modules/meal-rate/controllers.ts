import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { getAuthUser } from "../../utils/get-auth-user";
import { mealRateServices } from "./services";

const upsertMealRate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuthUser(req);

    const { fullMealRate, halfMealRate } = req.body;

    const updatedMealRate = await mealRateServices.upsertMealRate({
      fullMealRate,
      halfMealRate,
      managerId: userId,
    });

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Meal rate upserted successfully",
      data: updatedMealRate,
    });
  },
);

const getMealRate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuthUser(req);

    const mealRate = await mealRateServices.getMealRate(userId);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Meal rate fetched successfully",
      data: mealRate,
    });
  },
);

export const mealRateControllers = {
  upsertMealRate,
  getMealRate,
};
