import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import { authControllers } from "./controllers";
import { loginMessZodSchema, registerMessZodSchema } from "./validators";

const router = Router();

// POST: api/v1/auth/register-mess
router.post(
  "/register-mess",
  validateRequest(registerMessZodSchema),
  authControllers.registerMess,
);

// POST: api/v1/auth/login-mess
router.post(
  "/login-mess",
  validateRequest(loginMessZodSchema),
  authControllers.loginMess,
);

export const authRoutes = router;
