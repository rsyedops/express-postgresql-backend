import { hashPassword } from "#lib/crypto/hashPassword.js";
import { makeJWT } from "#lib/jwt/makeJWT.js";
import { isUniqueConstraintError } from "#shared/db-errors.js";
import { ConflictRequestError } from "#shared/errors.js";

import { User } from "./users.model.js";
import { insertUser } from "./users.queries.js";
import { registerUserParams } from "./users.schema.js";

export const createUser = async ({ user: { email, password, username } }: registerUserParams) => {
  const hashedPassword = await hashPassword(password);

  let newUser: User;

  try {
    newUser = await insertUser({
      email,
      hashedPassword,
      username,
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictRequestError(
        err.cause.constraint === "users_email_unique" ? "email already exists" : "username already exists",
      );
    }
    throw err;
  }

  const token = makeJWT(newUser);

  return {
    ...newUser,
    token,
  };
};
