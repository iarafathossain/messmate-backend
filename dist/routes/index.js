"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("../modules/auth/routes");
const routes_2 = require("../modules/deposit/routes");
const routes_3 = require("../modules/meal-rate/routes");
const routes_4 = require("../modules/meal-record/routes");
const routes_5 = require("../modules/mess-member/routes");
const routes_6 = require("../modules/dashboard/routes");
const routes_7 = require("../modules/mess-expense/routes");
const router = (0, express_1.Router)();
// auth routes
router.use("/auth", routes_1.authRoutes);
// meal rate routes
router.use("/meal-rate", routes_3.mealRateRoutes);
// mess member routes
router.use("/mess-member", routes_5.messMemberRoutes);
// deposit routes
router.use("/deposit", routes_2.depositRoutes);
// meal record routes
router.use("/meal-record", routes_4.mealRecordRoutes);
router.use("/dashboard", routes_6.dashboardRoutes);
router.use("/expense", routes_7.messExpenseRoutes);
exports.indexRoutes = router;
