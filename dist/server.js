"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./libs/prisma");
let server;
const main = async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log("✅Database connected successfully.");
        server = app_1.default.listen(env_1.envVariables.PORT, () => {
            console.log(`Server is running on port ${env_1.envVariables.PORT}`);
        });
    }
    catch (error) {
        await prisma_1.prisma.$disconnect();
        console.error("❌Failed to connect to the database:", error);
        process.exit(1);
    }
};
// SIGTERM Signal Handler for graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    if (server) {
        server.close(() => {
            console.log("✅HTTP server closed");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
// SIGINT Signal Handler for graceful shutdown
process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server");
    if (server) {
        server.close(() => {
            console.log("✅HTTP server closed");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
// UNCAUGHT EXCEPTION Handler for graceful shutdown
process.on("uncaughtException", (err) => {
    console.error("❌Uncaught Exception:", err);
    if (server) {
        server.close(() => {
            console.log("✅HTTP server closed due to uncaught exception");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// process.exit(0); // For testing graceful shutdown with SIGINT or SIGTERM
// process.exit(1); // For testing graceful shutdown with uncaughtException
main();
