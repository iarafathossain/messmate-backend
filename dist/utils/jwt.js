"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secrete, { expiresIn }) => {
    return jsonwebtoken_1.default.sign(payload, secrete, { expiresIn });
};
const verifyToken = (token, secrete) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secrete);
        return {
            success: true,
            data: decoded,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
const decodeToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.jwtUtils = {
    createToken,
    verifyToken,
    decodeToken,
};
