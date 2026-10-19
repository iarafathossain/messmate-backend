"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (zodSchema) => {
    return (req, res, next) => {
        const incomingBody = req.body ?? {};
        if (typeof incomingBody === "object" &&
            incomingBody !== null &&
            "data" in incomingBody &&
            typeof incomingBody.data === "string") {
            req.body = JSON.parse(incomingBody.data);
        }
        else {
            req.body = incomingBody;
        }
        const validationResult = zodSchema.safeParse(req.body);
        if (!validationResult.success) {
            return next(validationResult.error);
        }
        // sanitize the request body to only include the validated data
        req.body = validationResult.data;
        return next();
    };
};
exports.validateRequest = validateRequest;
