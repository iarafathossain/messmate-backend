"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRecordControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = require("../../shared/catch-async");
const send_response_1 = require("../../shared/send-response");
const get_auth_user_1 = require("../../utils/get-auth-user");
const services_1 = require("./services");
const upsertSingleMealRecord = (0, catch_async_1.catchAsync)(async (req, res) => {
    const { userId } = (0, get_auth_user_1.getAuthUser)(req);
    const payload = req.body;
    payload.managerId = userId;
    const result = await services_1.mealRecordServices.upsertSingleMealRecord(payload);
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.CREATED,
        success: true,
        message: payload.mealRecordId
            ? "Meal record updated successfully"
            : "Meal record created successfully",
        data: result,
    });
});
exports.mealRecordControllers = {
    upsertSingleMealRecord,
};
