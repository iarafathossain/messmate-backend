import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { mealRateServices } from "./services";

const upsertMealRate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // attach the userId from the authenticated user to the request body
    if (!req.user) {
      return next(new Error("Authenticated user not found in request"));
    }

    req.body.userId = req.user.userId;
    const { userId, fullMealRate, halfMealRate } = req.body;

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

export const mealRateControllers = {
  upsertMealRate,
};
