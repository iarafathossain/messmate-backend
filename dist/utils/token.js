"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenUtils = exports.parseDurationToMs = void 0;
const env_1 = require("../config/env");
const cookie_1 = require("./cookie");
const jwt_1 = require("./jwt");
const parseDurationToMs = (duration) => {
    const parsedDuration = duration.trim().toLowerCase();
    const match = parsedDuration.match(/^(\d+)(ms|s|m|h|d)$/);
    if (!match) {
        throw new Error(`Invalid duration format: "${duration}". Use formats like 500ms, 30s, 15m, 12h, or 7d.`);
    }
    const value = Number(match[1]);
    const unit = match[2];
    const unitToMs = {
        ms: 1,
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };
    return value * unitToMs[unit];
};
exports.parseDurationToMs = parseDurationToMs;
// Get Access token
const getAccessToken = (payload) => {
    return jwt_1.jwtUtils.createToken(payload, env_1.envVariables.ACCESS_TOKEN_SECRET, {
        expiresIn: env_1.envVariables.ACCESS_TOKEN_EXPIRES_IN,
    });
};
// Set Access token cookie
const setAccessTokenCookie = (res, token) => {
    cookie_1.cookieUtils.setCookie(res, "access-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: (0, exports.parseDurationToMs)(env_1.envVariables.ACCESS_TOKEN_COOKIE_MAX_AGE),
    });
};
exports.tokenUtils = {
    getAccessToken,
    setAccessTokenCookie,
};
