"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardControllers = void 0;
const catch_async_1 = require("../../shared/catch-async");
const send_response_1 = require("../../shared/send-response");
const get_auth_user_1 = require("../../utils/get-auth-user");
const services_1 = require("./services");
const getMonthlySheet = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { userId } = (0, get_auth_user_1.getAuthUser)(req);
    const year = Number(req.query.year);
    const month = Number(req.query.month);
    const data = await services_1.dashboardServices.getMonthlySheet(userId, year, month);
    (0, send_response_1.sendResponse)(res, { httpStatusCode: 200, success: true, message: "Monthly sheet fetched successfully", data });
});
const getMealSheet = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { userId } = (0, get_auth_user_1.getAuthUser)(req);
    const data = await services_1.dashboardServices.getMealSheet(userId);
    (0, send_response_1.sendResponse)(res, { httpStatusCode: 200, success: true, message: "Meal sheet fetched successfully", data });
});
exports.dashboardControllers = { getMonthlySheet, getMealSheet };
