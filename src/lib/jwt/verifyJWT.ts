import { env } from "#config/env.js";
import { UnauthorizedError } from "#shared/errors.js";
import jwt from "jsonwebtoken";

import { Payload } from "./makeJWT.js";

export const verifyJWT = (token: string) => {
  const payload = jwt.verify(token, env.JWT_SECRET) as Payload;

  if (!payload.sub) throw new UnauthorizedError("missing JWT sub");
  return payload.sub;
};
