import { articles, articlesFavorited, articleTags, profileFollows, users } from "#db/schema.js";
import { eq, sql } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";

//sub queries
export function favoritedByCurrentUserSq(currentUserId?: string) {
  return currentUserId
    ? sql<boolean>`EXISTS (SELECT 1 FROM ${articlesFavorited} WHERE ${articlesFavorited.articleId} = ${articles.id} AND ${articlesFavorited.userId} = ${currentUserId})`
    : sql<boolean>`FALSE`;
}

export function followingAuthorSq(currentUserId?: string) {
  return currentUserId
    ? sql<boolean>`EXISTS (SELECT 1 FROM ${profileFollows} WHERE ${profileFollows.followeeId} = ${users.id} AND ${profileFollows.followerId} = ${currentUserId})`
    : sql<boolean>`FALSE`;
}

export function tagListSq() {
  return sql<
    string[]
  >`ARRAY(SELECT ${articleTags.tag} FROM ${articleTags} WHERE ${eq(articleTags.articleId, articles.id)})`;
}

// filters
export function withAuthor<T extends PgSelect>(qb: T, author: string) {
  return qb.where(eq(users.username, author));
}

export function withFavorited<T extends PgSelect>(qb: T, favorited: string) {
  return qb.innerJoin(articlesFavorited, eq(articlesFavorited.userId, users.id)).where(eq(users.username, favorited));
}

export function withTag<T extends PgSelect>(qb: T, tag: string) {
  return qb.innerJoin(articleTags, eq(articleTags.articleId, articles.id)).where(eq(articleTags.tag, tag));
}
