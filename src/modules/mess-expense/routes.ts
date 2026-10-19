import { Router } from "express";
import { UserRoles } from "../../interfaces/auth-type";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { messExpenseControllers } from "./controllers";
import { expensePayloadSchema } from "./validators";

const router = Router();
router.get("/", checkAuth(UserRoles.MESS, UserRoles.MEMBER), messExpenseControllers.listExpenses);
router.post("/upsert", checkAuth(UserRoles.MESS), validateRequest(expensePayloadSchema), messExpenseControllers.upsertExpense);
export const messExpenseRoutes = router;
