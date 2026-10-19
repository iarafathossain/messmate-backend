"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = require("../../shared/catch-async");
const send_response_1 = require("../../shared/send-response");
const services_1 = require("./services");
const get_auth_user_1 = require("../../utils/get-auth-user");
const upsertDeposit = (0, catch_async_1.catchAsync)(async (req, res) => {
    const payload = { ...req.body, managerId: (0, get_auth_user_1.getAuthUser)(req).userId };
    const result = await services_1.depositServices.upsertDeposit(payload);
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.CREATED,
        success: true,
        message: payload.id
            ? "Deposit updated successfully"
            : "Deposit created successfully",
        data: result,
    });
});
exports.depositControllers = {
    upsertDeposit,
};
