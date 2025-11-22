import { UnauthorizedError } from "#shared/errors.js";
import { Request } from "express";

export const extractAuthToken = (req: Request) => {
  const header = req.get("Authorization")?.split(" ");
  if (!header || header.length < 2 || header[0] !== "Token") throw new UnauthorizedError("Missing Authorization");
  return header[1];
};
