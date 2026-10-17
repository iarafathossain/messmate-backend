import { Router } from "express";
import { authRoutes } from "../modules/auth/routes";

const router = Router();

// auth routes
router.use("/auth", authRoutes);

export const indexRoutes = router;
