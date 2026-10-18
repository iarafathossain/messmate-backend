import { Router } from "express";
import { UserRoles } from "../../interfaces/auth-type";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { mealRateControllers } from "./controllers";
import { upsertMealRateZodSchema } from "./validators";

const router = Router();

// POST: api/v1/meal-rate/upsert
router.post(
  "/upsert",
  validateRequest(upsertMealRateZodSchema),
  checkAuth(UserRoles.MANAGER),
  mealRateControllers.upsertMealRate,
);

export const mealRateRoutes = router;
