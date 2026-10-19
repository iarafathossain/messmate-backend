"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessCode = void 0;
const node_crypto_1 = require("node:crypto");
const generateMessCode = () => (0, node_crypto_1.randomBytes)(4).toString("hex").toUpperCase();
exports.generateMessCode = generateMessCode;
