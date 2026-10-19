import { Router } from "express";
import { UserRoles } from "../../interfaces/auth-type";
import { checkAuth } from "../../middlewares/check-auth";
import { dashboardControllers } from "./controllers";

const router = Router();
router.get("/monthly-sheet", checkAuth(UserRoles.MESS, UserRoles.MEMBER), dashboardControllers.getMonthlySheet);
router.get("/meal-sheet", checkAuth(UserRoles.MESS, UserRoles.MEMBER), dashboardControllers.getMealSheet);
export const dashboardRoutes = router;
