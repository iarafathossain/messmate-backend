"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleZodError = (error) => {
    const statusCode = http_status_1.default.BAD_REQUEST;
    const message = "Validation error";
    const errorSources = [];
    error.issues.forEach((issue) => {
        errorSources.push({
            message: issue.message,
            path: issue.path.join(" => "),
        });
    });
    return {
        success: false,
        message,
        errorSources,
        statusCode,
    };
};
exports.handleZodError = handleZodError;
