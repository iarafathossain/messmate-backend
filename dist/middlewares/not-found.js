"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const notFoundHandler = (req, res) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        statusCode: http_status_1.default.NOT_FOUND,
        message: "The requested resource was not found.",
        errorSources: [
            {
                message: "No route matched the requested URL.",
                path: `${req.method} ${req.originalUrl}`,
            },
        ],
    });
};
exports.notFoundHandler = notFoundHandler;
