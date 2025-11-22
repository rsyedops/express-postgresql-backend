import { hashPassword } from "#lib/crypto/hashPassword.js";
import { makeJWT } from "#lib/jwt/makeJWT.js";
import { isUniqueConstraintError } from "#shared/db-errors.js";
import { ConflictRequestError } from "#shared/errors.js";

import { insertUser } from "./users.queries.js";
import { registerUserParams } from "./users.schema.js";

export const createUser = async ({ email, password, username }: registerUserParams["user"]) => {
  const hashedPassword = await hashPassword(password);

  try {
    const newUser = await insertUser({
      email,
      hashedPassword,
      username,
    });
    const token = makeJWT(newUser.id);

    return {
      ...newUser,
      token,
    };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictRequestError(
        err.cause.constraint === "users_email_unique" ? "email already exists" : "username already exists",
      );
    }
    throw err;
  }
};
