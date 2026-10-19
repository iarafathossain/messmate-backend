import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { messMemberControllers } from "./controllers";

const router = Router();

// GET: api/mess-member
router.get("/", checkAuth(), messMemberControllers.listMessMembers);

// GET: api/mess-member/:messMemberId
router.get(
  "/:messMemberId",
  checkAuth(),
  messMemberControllers.getMessMemberById,
);

export const messMemberRoutes = router;
