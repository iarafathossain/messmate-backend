"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messMemberRoutes = void 0;
const express_1 = require("express");
const check_auth_1 = require("../../middlewares/check-auth");
const controllers_1 = require("./controllers");
const router = (0, express_1.Router)();
// GET: api/mess-member
router.get("/", (0, check_auth_1.checkAuth)(), controllers_1.messMemberControllers.listMessMembers);
// GET: api/mess-member/:messMemberId
router.get("/:messMemberId", (0, check_auth_1.checkAuth)(), controllers_1.messMemberControllers.getMessMemberById);
exports.messMemberRoutes = router;
