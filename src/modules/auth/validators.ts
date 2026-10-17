import * as zod from "zod";
import { MessType } from "../../generated/prisma/enums";

export const registerMessZodSchema = zod
  .object({
    name: zod
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be at most 100 characters long"),
    email: zod.email("Invalid email address"),
    messType: zod.enum(MessType),
    password: zod
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be at most 50 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)",
      ),
    confirmPassword: zod.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"],
  });

export const loginMessZodSchema = zod.object({
  email: zod.email("Invalid email address"),
  password: zod.string().min(1, "Password is required"),
});
