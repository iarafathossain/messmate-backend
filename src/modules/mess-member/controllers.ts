import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { messMemberServices } from "./services";

const listMessMembers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const messMembers = await messMemberServices.listMessMembers();

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Mess members fetched successfully",
      data: messMembers,
    });
  },
);

const getMessMemberById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // read messMemberId from the params
    const { messMemberId } = req.params;

    // if messMemberId is not provided, return 400
    if (!messMemberId) {
      return next(new Error("Mess member ID is required"));
    }

    // ensure the messMemberId is a string
    if (typeof messMemberId !== "string") {
      return next(new Error("Mess member ID must be a string"));
    }

    const messMember = await messMemberServices.getMessMemberById(messMemberId);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Mess member fetched successfully",
      data: messMember,
    });
  },
);

export const messMemberControllers = {
  listMessMembers,
  getMessMemberById,
};
