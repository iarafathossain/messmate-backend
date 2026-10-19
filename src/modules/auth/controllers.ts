import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { tokenUtils } from "../../utils/token";
import { authServices } from "./services";

const registerMess = catchAsync(async (req, res) => {
  const { name, messName, email, phone, password, messType } = req.body;

  const result = await authServices.registerMess({
    name,
    email,
    phone,
    messName,
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
    data: result,
  });
});

const loginMess = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await authServices.login(email, password);

  // set cookie if access token is generated
  if (result.accessToken) {
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
  }

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const registerMember = catchAsync(async (req, res) => {
  const { name, email, phone, password, messCode } = req.body;

  const result = await authServices.registerMember({
    name,
    email,
    phone,
    password,
    messCode,
  });

  // set cookie if access token is generated
  if (result.accessToken) {
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
  }

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Member registered successfully",
    data: result.user,
  });
});

export const authControllers = {
  registerMess,
  loginMess,
  registerMember,
};
