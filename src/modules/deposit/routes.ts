import { Router } from "express";
import { UserRoles } from "../../interfaces/auth-type";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { depositControllers } from "./controllers";
import { upsertDepositZodSchema } from "./validators";

const router = Router();

// POST: api/deposit/upsert
router.post(
  "/upsert",
  checkAuth(UserRoles.MESS),
  validateRequest(upsertDepositZodSchema),
  depositControllers.upsertDeposit,
);

export const depositRoutes = router;
