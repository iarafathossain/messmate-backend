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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMemberZodSchema = exports.loginMessZodSchema = exports.registerMessZodSchema = void 0;
const zod = __importStar(require("zod"));
const enums_1 = require("../../generated/prisma/enums");
exports.registerMessZodSchema = zod
    .object({
    name: zod
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters long"),
    messName: zod
        .string()
        .min(1, "Mess name is required")
        .max(100, "Mess name must be at most 100 characters long"),
    phone: zod
        .string()
        .min(1, "Phone number is required")
        .regex(/^0\d{10}$/, "Phone number must be 11 digits and start with 0"),
    email: zod.email("Invalid email address"),
    messType: zod.enum(enums_1.MessType),
    password: zod
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password must be at most 50 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)"),
    confirmPassword: zod.string().min(1, "Confirm password is required"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"],
});
exports.loginMessZodSchema = zod.object({
    email: zod.email("Invalid email address"),
    password: zod.string().min(1, "Password is required"),
});
exports.registerMemberZodSchema = zod
    .object({
    name: zod
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters long"),
    phone: zod
        .string()
        .min(1, "Phone number is required")
        .regex(/^0\d{10}$/, "Phone number must be 11 digits and start with 0"),
    email: zod.email("Invalid email address"),
    messCode: zod
        .string()
        .min(1, "Mess code is required"),
    password: zod
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password must be at most 50 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)"),
    confirmPassword: zod.string().min(1, "Confirm password is required"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"],
});
