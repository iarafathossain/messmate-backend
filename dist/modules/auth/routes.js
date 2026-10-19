"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const validate_request_1 = require("../../middlewares/validate-request");
const controllers_1 = require("./controllers");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
// POST: api/v1/auth/register-mess
router.post("/register-mess", (0, validate_request_1.validateRequest)(validators_1.registerMessZodSchema), controllers_1.authControllers.registerMess);
// POST: api/v1/auth/login
router.post("/login", (0, validate_request_1.validateRequest)(validators_1.loginMessZodSchema), controllers_1.authControllers.loginMess);
// POST: api/v1/auth/register-member
router.post("/register-member", (0, validate_request_1.validateRequest)(validators_1.registerMemberZodSchema), controllers_1.authControllers.registerMember);
exports.authRoutes = router;
