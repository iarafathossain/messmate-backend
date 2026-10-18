import { randomBytes } from "node:crypto";

export const generateMessCode = () =>
  randomBytes(4).toString("hex").toUpperCase();
