import { Request } from "express";
import status from "http-status";
import AppError from "../errors/app-error";

export const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Authenticated user not found in request",
    );
  }
  return req.user;
};
