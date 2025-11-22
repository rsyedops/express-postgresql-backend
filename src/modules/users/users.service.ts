import { hashPassword } from "#lib/crypto/hashPassword.js";
import { verifyPassword } from "#lib/crypto/verifyPassword.js";
import { makeJWT } from "#lib/jwt/makeJWT.js";
import { isUniqueConstraintError } from "#shared/db-errors.js";
import { ConflictRequestError, NotFoundError, UnauthorizedError } from "#shared/errors.js";

import { findUserByEmail, insertUser } from "./users.queries.js";
import { LoginUserParams, registerUserParams } from "./users.schema.js";

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

export const loginUser = async ({ email, password }: LoginUserParams["user"]) => {
  const user = await findUserByEmail(email);
  if (!user) throw new NotFoundError(`user with email: ${email} not found`);

  const matches = await verifyPassword(user.hashedPassword, password);
  if (!matches) throw new UnauthorizedError("password is invalid");

  const token = makeJWT(user.id);

  return {
    ...user,
    token,
  };
};
