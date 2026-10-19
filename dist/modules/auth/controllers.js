"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const catch_async_1 = require("../../shared/catch-async");
const send_response_1 = require("../../shared/send-response");
const token_1 = require("../../utils/token");
const services_1 = require("./services");
const registerMess = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { name, messName, email, phone, password, messType } = req.body;
    const result = await services_1.authServices.registerMess({
        name,
        email,
        phone,
        messName,
        password,
        messType,
    });
    // set cookie if access token is generated
    if (result.accessToken) {
        token_1.tokenUtils.setAccessTokenCookie(res, result.accessToken);
    }
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: 201,
        success: true,
        message: "Mess registered successfully",
        data: result,
    });
});
const loginMess = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    const result = await services_1.authServices.login(email, password);
    // set cookie if access token is generated
    if (result.accessToken) {
        token_1.tokenUtils.setAccessTokenCookie(res, result.accessToken);
    }
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: 200,
        success: true,
        message: "Login successful",
        data: result,
    });
});
const registerMember = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { name, email, phone, password, messCode } = req.body;
    const result = await services_1.authServices.registerMember({
        name,
        email,
        phone,
        password,
        messCode,
    });
    // set cookie if access token is generated
    if (result.accessToken) {
        token_1.tokenUtils.setAccessTokenCookie(res, result.accessToken);
    }
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: 201,
        success: true,
        message: "Member registered successfully",
        data: result,
    });
});
exports.authControllers = {
    registerMess,
    loginMess,
    registerMember,
};
