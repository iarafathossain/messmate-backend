import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVariables } from "../config/env";
import AppError from "../errors/app-error";
import { TUserRole } from "../interfaces/auth-type";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const checkAuth =
  (...authRoles: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // access token verification
      const accessToken = cookieUtils.getCookie(req, "access_token");

      if (!accessToken) {
        return next(
          new AppError(
            status.UNAUTHORIZED,
            "Unauthorized Access! No access token provided",
          ),
        );
      }

      // verify access token
      const { success, data } = jwtUtils.verifyToken(
        accessToken,
        envVariables.ACCESS_TOKEN_SECRET,
      );

      if (!success || !data) {
        return next(
          new AppError(
            status.UNAUTHORIZED,
            "Unauthorized Access! Invalid access token",
          ),
        );
      }

      // check if the user has the required role
      if (authRoles.length > 0 && !authRoles.includes(data.role)) {
        return next(
          new AppError(
            status.FORBIDDEN,
            "Forbidden Access! You don't have permission to access this resource",
          ),
        );
      }

      // attach the user data to the request object for further use
      req.user = data;

      next();
    } catch (error) {
      next(error);
    }
  };
