import { Router } from "express";
import { authRoutes } from "../modules/auth/routes";
import { mealRateRoutes } from "../modules/meal-rate/routes";

const router = Router();

// auth routes
router.use("/auth", authRoutes);
// meal rate routes
router.use("/meal-rate", mealRateRoutes);

export const indexRoutes = router;
