import { verifyJWT } from "#lib/jwt/verifyJWT.js";
import { UnauthorizedError } from "#shared/errors.js";
import { AuthenticatedRequest } from "#shared/schemas.js";
import { extractAuthToken } from "#utils/extractAuthToken.js";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const optionalAuthMiddleware: RequestHandler = (req, _res, next) => {
  try {
    const token = extractAuthToken(req);
    const sub = verifyJWT(token);
    (req as AuthenticatedRequest).userId = sub;
  } catch (err) {
    // if no token found in header, continue to next() without throwing
    if (err instanceof UnauthorizedError) {
      next();
      return;
    }
    // if token found but invalid, then throw
    if (err instanceof jwt.JsonWebTokenError) throw new UnauthorizedError(err.message);
    throw err;
  }
  next();
};
