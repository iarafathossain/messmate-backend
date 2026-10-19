"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariables = void 0;
require("dotenv/config");
const loadEnvironmentVariables = () => {
    // required environment variables
    const requiredEnvVars = [
        "DATABASE_URL",
        "PORT",
        "NODE_ENV",
        "ACCESS_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "ACCESS_TOKEN_COOKIE_MAX_AGE",
        "FRONTEND_URL",
    ];
    requiredEnvVars.forEach((variable) => {
        if (!process.env[variable]) {
            throw new Error(`Environment variable ${variable} is required but not defined.`);
        }
    });
    return {
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
        ACCESS_TOKEN_COOKIE_MAX_AGE: process.env.ACCESS_TOKEN_COOKIE_MAX_AGE,
        FRONTEND_URL: process.env.FRONTEND_URL,
    };
};
exports.envVariables = loadEnvironmentVariables();
