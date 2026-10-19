"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const env_1 = require("../config/env");
const app_error_1 = __importDefault(require("../errors/app-error"));
const cookie_1 = require("../utils/cookie");
const jwt_1 = require("../utils/jwt");
const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        // access token verification
        const accessToken = cookie_1.cookieUtils.getCookie(req, "access-token") ||
            req.headers.authorization?.replace(/^Bearer\s+/i, "");
        if (!accessToken) {
            return next(new app_error_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access! No access token provided"));
        }
        // verify access token
        const { success, data } = jwt_1.jwtUtils.verifyToken(accessToken, env_1.envVariables.ACCESS_TOKEN_SECRET);
        if (!success || !data) {
            return next(new app_error_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access! Invalid access token"));
        }
        // check if the user has the required role
        if (authRoles.length > 0 && !authRoles.includes(data.role)) {
            return next(new app_error_1.default(http_status_1.default.FORBIDDEN, "Forbidden Access! You don't have permission to access this resource"));
        }
        // attach the user data to the request object for further use
        req.user = data;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAuth = checkAuth;
