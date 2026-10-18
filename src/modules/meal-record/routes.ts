import { Router } from "express";
import { UserRoles } from "../../interfaces/auth-type";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { mealRecordControllers } from "./controllers";
import { upsertMealRecordZodSchema } from "./validators";

const router = Router();

// POST: api/meal-record/upsert-single-meal-record
router.post(
  "/upsert-single-meal-record",
  checkAuth(UserRoles.MANAGER),
  validateRequest(upsertMealRecordZodSchema),
  mealRecordControllers.upsertSingleMealRecord,
);

export const mealRecordRoutes = router;
