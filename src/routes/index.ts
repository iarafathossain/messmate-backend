import { Router } from "express";
import { authRoutes } from "../modules/auth/routes";
import { depositRoutes } from "../modules/deposit/routes";
import { mealRateRoutes } from "../modules/meal-rate/routes";
import { mealRecordRoutes } from "../modules/meal-record/routes";
import { messMemberRoutes } from "../modules/mess-member/routes";

const router = Router();

// auth routes
router.use("/auth", authRoutes);
// meal rate routes
router.use("/meal-rate", mealRateRoutes);
// mess member routes
router.use("/mess-member", messMemberRoutes);
// deposit routes
router.use("/deposit", depositRoutes);
// meal record routes
router.use("/meal-record", mealRecordRoutes);

export const indexRoutes = router;
