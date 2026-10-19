"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRecordRoutes = void 0;
const express_1 = require("express");
const auth_type_1 = require("../../interfaces/auth-type");
const check_auth_1 = require("../../middlewares/check-auth");
const validate_request_1 = require("../../middlewares/validate-request");
const controllers_1 = require("./controllers");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
// POST: api/meal-record/upsert-single-meal-record
router.post("/upsert-single-meal-record", (0, check_auth_1.checkAuth)(auth_type_1.UserRoles.MESS), (0, validate_request_1.validateRequest)(validators_1.upsertMealRecordZodSchema), controllers_1.mealRecordControllers.upsertSingleMealRecord);
exports.mealRecordRoutes = router;
