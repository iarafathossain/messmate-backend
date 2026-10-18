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
  checkAuth(UserRoles.MANAGER),
  validateRequest(upsertMealRateZodSchema),
  mealRateControllers.upsertMealRate,
);

// GET: api/v1/meal-rate
router.get(
  "/",
  checkAuth(UserRoles.MANAGER, UserRoles.MEMBER),
  mealRateControllers.getMealRate,
);

export const mealRateRoutes = router;
