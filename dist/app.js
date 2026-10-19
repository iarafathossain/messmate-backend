"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const global_error_handler_1 = require("./middlewares/global-error-handler");
const not_found_1 = require("./middlewares/not-found");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
// Configure CORS middleware
app.use((0, cors_1.default)({
    origin: [env_1.envVariables.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
}));
// Enable urlencoded body parsing
app.use(express_1.default.urlencoded({ extended: true }));
// Enable JSON body parsing
app.use(express_1.default.json());
// Parse Cookie header into req.cookies
app.use((0, cookie_parser_1.default)());
// Use the index routes
app.use("/api/v1", routes_1.indexRoutes);
// Root route renders an HTML file
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "index.html"));
});
// Health check route for cron-job.org
app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", message: "Server is wide awake!" });
});
// Global error handler
app.use(global_error_handler_1.globalErrorHandler);
// not found route handler
app.use(not_found_1.notFoundHandler);
exports.default = app;
