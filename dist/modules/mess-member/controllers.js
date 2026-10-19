"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messMemberControllers = void 0;
const catch_async_1 = require("../../shared/catch-async");
const send_response_1 = require("../../shared/send-response");
const services_1 = require("./services");
const listMessMembers = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const messMembers = await services_1.messMemberServices.listMessMembers();
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: 200,
        success: true,
        message: "Mess members fetched successfully",
        data: messMembers,
    });
});
const getMessMemberById = (0, catch_async_1.catchAsync)(async (req, res, next) => {
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
    const messMember = await services_1.messMemberServices.getMessMemberById(messMemberId);
    (0, send_response_1.sendResponse)(res, {
        httpStatusCode: 200,
        success: true,
        message: "Mess member fetched successfully",
        data: messMember,
    });
});
exports.messMemberControllers = {
    listMessMembers,
    getMessMemberById,
};
