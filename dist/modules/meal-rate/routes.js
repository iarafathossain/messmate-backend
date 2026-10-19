"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRateRoutes = void 0;
const express_1 = require("express");
const auth_type_1 = require("../../interfaces/auth-type");
const check_auth_1 = require("../../middlewares/check-auth");
const validate_request_1 = require("../../middlewares/validate-request");
const controllers_1 = require("./controllers");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
// POST: api/v1/meal-rate/upsert
router.post("/upsert", (0, check_auth_1.checkAuth)(auth_type_1.UserRoles.MESS), (0, validate_request_1.validateRequest)(validators_1.upsertMealRateZodSchema), controllers_1.mealRateControllers.upsertMealRate);
// GET: api/v1/meal-rate
router.get("/", (0, check_auth_1.checkAuth)(auth_type_1.UserRoles.MESS, auth_type_1.UserRoles.MEMBER), controllers_1.mealRateControllers.getMealRate);
exports.mealRateRoutes = router;
