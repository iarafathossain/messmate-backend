"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRateControllers = void 0;
const catch_async_1 = require("../../shared/catch-async");
const send_response_1 = require("../../shared/send-response");
const get_auth_user_1 = require("../../utils/get-auth-user");
const services_1 = require("./services");
const upsertMealRate = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const { userId } = (0, get_auth_user_1.getAuthUser)(req);
    const { fullMealRate, halfMealRate } = req.body;
    const updatedMealRate = await services_1.mealRateServices.upsertMealRate({
        fullMealRate,
        halfMealRate,
        managerId: userId,
    });
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: 200,
        success: true,
        message: "Meal rate upserted successfully",
        data: updatedMealRate,
    });
});
const getMealRate = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const { userId } = (0, get_auth_user_1.getAuthUser)(req);
    const mealRate = await services_1.mealRateServices.getMealRate(userId);
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: 200,
        success: true,
        message: "Meal rate fetched successfully",
        data: mealRate,
    });
});
exports.mealRateControllers = {
    upsertMealRate,
    getMealRate,
};
