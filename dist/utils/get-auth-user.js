"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const getAuthUser = (req) => {
    if (!req.user) {
        throw new app_error_1.default(http_status_1.default.UNAUTHORIZED, "Authenticated user not found in request");
    }
    return req.user;
};
exports.getAuthUser = getAuthUser;
