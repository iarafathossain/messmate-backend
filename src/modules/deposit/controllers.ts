import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { depositServices } from "./services";
import { getAuthUser } from "../../utils/get-auth-user";

const upsertDeposit = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body, managerId: getAuthUser(req).userId };
  const result = await depositServices.upsertDeposit(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: payload.id
      ? "Deposit updated successfully"
      : "Deposit created successfully",
    data: result,
  });
});

export const depositControllers = {
  upsertDeposit,
};
