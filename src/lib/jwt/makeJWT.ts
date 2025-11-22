import { env } from "#config/env.js";
import jwt from "jsonwebtoken";

type Payload = Pick<jwt.JwtPayload, "exp" | "iat" | "iss" | "sub">;

export const makeJWT = (id: string) => {
  const payload: Payload = {
    exp: env.JWT_EXP,
    iat: Date.now(),
    iss: env.JWT_ISSUER,
    sub: id,
  };

  const token = jwt.sign(payload, env.JWT_SECRET);

  return token;
};
