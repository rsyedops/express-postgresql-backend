import { articles, articlesFavorited, articleTags, profileFollows, users } from "#db/schema.js";
import { eq, sql } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";

//sub queries
export function currentUserfollowingAuthorSq(currentUserId?: string) {
  return currentUserId
    ? sql<boolean>`EXISTS (SELECT 1 FROM ${profileFollows} WHERE ${profileFollows.followeeId} = ${users.id} AND ${profileFollows.followerId} = ${currentUserId})`
    : sql<boolean>`FALSE`;
}

export function favoritedByCurrentUserSq(currentUserId?: string) {
  return currentUserId
    ? sql<boolean>`EXISTS (SELECT 1 FROM ${articlesFavorited} WHERE ${articlesFavorited.articleId} = ${articles.id} AND ${articlesFavorited.userId} = ${currentUserId})`
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

export function withFavorited<T extends PgSelect>(qb: T, favoritedByUserId: string) {
  return qb
    .innerJoin(articlesFavorited, eq(articlesFavorited.articleId, articles.id))
    .where(eq(articlesFavorited.userId, favoritedByUserId));
}

export function withPagination<T extends PgSelect>(qb: T, limit?: number, offset?: number) {
  return qb.limit(limit ?? 20).offset(offset ?? 0);
}

export function withSlug<T extends PgSelect>(qb: T, slug: string) {
  return qb.where(eq(articles.slug, slug));
}

export function withTag<T extends PgSelect>(qb: T, tag: string) {
  return qb.innerJoin(articleTags, eq(articleTags.articleId, articles.id)).where(eq(articleTags.tag, tag));
}
