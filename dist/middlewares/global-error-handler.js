"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const zod = __importStar(require("zod"));
const env_1 = require("../config/env");
const app_error_1 = __importDefault(require("../errors/app-error"));
const handle_zod_error_1 = require("../errors/handle-zod-error");
const prisma_error_1 = require("../errors/prisma-error");
const client_1 = require("../generated/prisma/client");
const globalErrorHandler = (err, _req, res, _next) => {
    if (env_1.envVariables.NODE_ENV === "development") {
        console.error("Global Error:", err);
    }
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let errorSources = [];
    let stack = undefined;
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, prisma_error_1.handlePrismaClientKnownRequestError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        const simplifiedError = (0, prisma_error_1.handlePrismaClientUnknownError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, prisma_error_1.handlePrismaClientValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        const simplifiedError = (0, prisma_error_1.handlerPrismaClientInitializationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof client_1.Prisma.PrismaClientRustPanicError) {
        const simplifiedError = (0, prisma_error_1.handlerPrismaClientRustPanicError)();
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof zod.ZodError) {
        const simplifiedError = (0, handle_zod_error_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof app_error_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: "AppError",
                message: err.message,
            },
        ];
        stack = err.stack;
    }
    else if (err instanceof Error) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = err.message;
        errorSources = [
            {
                message: err.message,
                path: "Error",
            },
        ];
        stack = err.stack;
    }
    const errorResponse = {
        success: false,
        statusCode,
        message,
        errorSources,
        stack: env_1.envVariables.NODE_ENV === "development" ? stack : undefined,
        error: env_1.envVariables.NODE_ENV === "development" ? err : undefined,
    };
    res.status(statusCode).json(errorResponse);
};
exports.globalErrorHandler = globalErrorHandler;
