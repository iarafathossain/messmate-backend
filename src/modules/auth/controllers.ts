import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { tokenUtils } from "../../utils/token";
import { authServices } from "./services";

const registerMess = catchAsync(async (req, res) => {
  const { name, email, password, messType } = req.body;

  const result = await authServices.registerMess({
    name,
    email,
    password,
    messType,
  });

  // set cookie if access token is generated
  if (result.accessToken) {
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
  }

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Mess registered successfully",
    data: result.user,
  });
});

const loginMess = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await authServices.loginMess(email, password);

  // set cookie if access token is generated
  if (result.accessToken) {
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
  }

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Login successful",
    data: result.user,
  });
});

export const authControllers = {
  registerMess,
  loginMess,
};
