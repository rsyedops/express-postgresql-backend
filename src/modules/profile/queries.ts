import { db } from "#db/index.js";
import { users } from "#db/schema.js";
import { firstOrUndefined } from "#utils/firstOrUndefined.js";
import { and, eq, sql } from "drizzle-orm";

import { profileFollows } from "./model.js";

export const findProfileWithFollowing = async (username: string, currentUserId: string) => {
  const result = await db
    .select({
      bio: users.bio,
      following: sql<boolean>`CASE WHEN ${profileFollows.followerId} IS NULL THEN false ELSE true END`,
      image: users.image,
      username: users.username,
    })
    .from(users)
    .leftJoin(
      profileFollows,
      and(eq(profileFollows.followerId, currentUserId), eq(profileFollows.followeeId, users.id)),
    )
    .where(eq(users.username, username));

  return firstOrUndefined(result);
};

export const InsertProfileFollow = async (userId: string, currentUserId: string) => {
  const result = await db
    .insert(profileFollows)
    .values({
      followeeId: userId,
      followerId: currentUserId,
    })
    .returning();

  return result[0];
};

export const DeleteProfileFollow = async (userId: string, currentUserId: string) => {
  const result = await db
    .delete(profileFollows)
    .where(and(eq(profileFollows.followerId, currentUserId), eq(profileFollows.followeeId, userId)));
  return result;
};
