"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleOrThrow = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const getRoleOrThrow = async (tx, roleName) => {
    const role = await tx.role.findUnique({
        where: { name: roleName },
    });
    if (!role) {
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Required role '${roleName}' is not configured`);
    }
    return role;
};
exports.getRoleOrThrow = getRoleOrThrow;
