"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getError = void 0;
const getError = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    else if (typeof error === "string") {
        return error;
    }
    else {
        return "An unknown error occurred.";
    }
};
exports.getError = getError;
