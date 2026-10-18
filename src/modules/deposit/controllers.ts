import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { depositServices } from "./services";

const upsertDeposit = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
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
