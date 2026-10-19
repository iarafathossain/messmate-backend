import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { getAuthUser } from "../../utils/get-auth-user";
import { mealRecordServices } from "./services";

const upsertSingleMealRecord = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = getAuthUser(req);

    const payload = req.body;
    payload.managerId = userId;

    const result = await mealRecordServices.upsertSingleMealRecord(payload);

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: payload.mealRecordId
        ? "Meal record updated successfully"
        : "Meal record created successfully",
      data: result,
    });
  },
);

export const mealRecordControllers = {
  upsertSingleMealRecord,
};
