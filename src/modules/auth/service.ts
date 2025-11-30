import { hashPassword } from "#lib/crypto/hashPassword.js";
import { verifyPassword } from "#lib/crypto/verifyPassword.js";
import { makeJWT } from "#lib/jwt/makeJWT.js";
import { isUniqueConstraintError } from "#shared/db-errors.js";
import { ConflictRequestError, NotFoundError, UnauthorizedError } from "#shared/errors.js";
import { makeAvatarUrl } from "#utils/makeAvatarUrl.js";

import { findUserBy, insertUser, updateUserById } from "./queries.js";
import { LoginUserParams, registerUserParams, UpdateUserParams } from "./schema.js";

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
      image: makeAvatarUrl(newUser.image),
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
  const user = await findUserBy("email", email);
  if (!user) throw new NotFoundError(`user with email: ${email} not found`);

  const matches = await verifyPassword(user.hashedPassword, password);
  if (!matches) throw new UnauthorizedError("password is invalid");

  const token = makeJWT(user.id);

  return {
    ...user,
    image: makeAvatarUrl(user.image),
    token,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await findUserBy("id", userId);
  if (!user) throw new NotFoundError(`user with id: ${userId} not found`);

  return { ...user, image: makeAvatarUrl(user.image) };
};

export const updateUser = async (userId: string, newUser: UpdateUserParams["user"]) => {
  let hashedPassword: string | undefined = undefined;

  if (newUser.password) hashedPassword = await hashPassword(newUser.password);

  let user: Awaited<ReturnType<typeof updateUserById>> | undefined;

  try {
    user = await updateUserById(userId, {
      ...newUser,
      hashedPassword,
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictRequestError(
        err.cause.constraint === "users_email_unique" ? "email already exists" : "username already exists",
      );
    }
    throw err;
  }
  if (!user) throw new NotFoundError("user not found");

  return {
    ...user,
    image: makeAvatarUrl(user.image),
  };
};
