import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import path from "path";
import { envVariables } from "./config/env";
import { globalErrorHandler } from "./middlewares/global-error-handler";
import { notFoundHandler } from "./middlewares/not-found";
import { indexRoutes } from "./routes";

const app: Application = express();

// Configure CORS middleware
app.use(
  cors({
    origin: [envVariables.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
  }),
);

// Enable urlencoded body parsing
app.use(express.urlencoded({ extended: true }));

// Enable JSON body parsing
app.use(express.json());

// Parse Cookie header into req.cookies
app.use(cookieParser());

// Use the index routes
app.use("/api/v1", indexRoutes);

// Root route renders an HTML file
app.get("/", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Health check route for cron-job.org
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is wide awake!" });
});

// Global error handler
app.use(globalErrorHandler);

// not found route handler
app.use(notFoundHandler);

export default app;
