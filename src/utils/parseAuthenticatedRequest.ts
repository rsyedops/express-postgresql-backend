import { UnauthorizedError } from "#shared/errors.js";
import { authenticatedRequestSchema } from "#shared/schemas.js";
import { Request } from "express";

/* We already handle authenticated requests in the middleware, but this helper is useful in controllers.
   Ensures type safety, and fallback in case we forgot to include middleware before the route handler.
*/
export function parseAuthenticatedRequest(
  req: Request & { userId?: string },
  required: false,
): undefined | { userId: string };

export function parseAuthenticatedRequest(req: Request & { userId?: string }, required?: true): { userId: string };

export function parseAuthenticatedRequest(req: Request & { userId?: string }, required = true) {
  const result = authenticatedRequestSchema.safeParse({ userId: req.userId });
  if (required && !result.success) throw new UnauthorizedError();

  return result.data;
}
