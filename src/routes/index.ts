import { Router } from "express";
import { authRoutes } from "../modules/auth/routes";
import { mealRateRoutes } from "../modules/meal-rate/routes";
import { messMemberRoutes } from "../modules/mess-member/routes";

const router = Router();

// auth routes
router.use("/auth", authRoutes);
// meal rate routes
router.use("/meal-rate", mealRateRoutes);
// mess member routes
router.use("/mess-member", messMemberRoutes);

export const indexRoutes = router;
