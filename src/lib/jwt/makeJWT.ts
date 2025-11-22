import { env } from "#config/env.js";
import { User } from "#modules/users/users.model.js";
import jwt from "jsonwebtoken";

type Payload = Pick<jwt.JwtPayload, "exp" | "iat" | "iss" | "sub">;

export const makeJWT = (user: User) => {
  const payload: Payload = {
    exp: env.JWT_EXP,
    iat: Date.now(),
    iss: env.JWT_ISSUER,
    sub: JSON.stringify(user),
  };

  const token = jwt.sign(payload, env.JWT_SECRET);

  return token;
};
