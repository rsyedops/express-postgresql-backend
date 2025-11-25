import { findUserBy } from "#modules/auth/queries.js";
import { isUniqueConstraintError } from "#shared/db-errors.js";
import { BadRequestError, NotFoundError } from "#shared/errors.js";

import { DeleteProfileFollow, findProfileWithFollowing, InsertProfileFollow } from "./queries.js";

export const getProfile = async (username: string, currentUserId?: string) => {
  if (currentUserId) {
    const profile = await findProfileWithFollowing(username, currentUserId);
    if (!profile) throw new NotFoundError(`Profile ${username} not found`);
    return profile;
  }

  const user = await findUserBy("username", username);
  if (!user) throw new NotFoundError(`Profile ${username} not found`);

  return { ...user, following: false };
};

export const followProfile = async (username: string, currentUserId: string) => {
  const followee = await findUserBy("username", username);
  if (!followee) throw new NotFoundError(`user ${username} not found`);

  try {
    await InsertProfileFollow(followee.id, currentUserId);
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new BadRequestError(`Already following ${username}`);
    throw error;
  }
  return {
    ...followee,
    following: true,
  };
};

export const unfollowProfile = async (username: string, currentUserId: string) => {
  const followee = await findUserBy("username", username);
  if (!followee) throw new NotFoundError(`user ${username} not found`);

  await DeleteProfileFollow(followee.id, currentUserId);
  return {
    ...followee,
    following: false,
  };
};
