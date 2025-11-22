import { verifyJWT } from "#lib/jwt/verifyJWT.js";
import { UnauthorizedError } from "#shared/errors.js";
import { AuthenticatedRequest } from "#shared/schemas.js";
import { extractAuthToken } from "#utils/extractAuthToken.js";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const requireAuthMiddleware: RequestHandler = (req, _res, next) => {
  const token = extractAuthToken(req);

  try {
    const sub = verifyJWT(token);
    (req as AuthenticatedRequest).userId = sub;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) throw new UnauthorizedError(err.message);
    throw err;
  }
  next();
};
