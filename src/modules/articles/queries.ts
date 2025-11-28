import { db, TransactionType } from "#db/index.js";
import { profileFollows, users } from "#db/schema.js";
import { firstOrUndefined } from "#utils/firstOrUndefined.js";
import { and, count, desc, eq } from "drizzle-orm";

import {
  favoritedByCurrentUserSq,
  followingAuthorSq,
  tagListSq,
  withAuthor,
  withFavorited,
  withTag,
} from "./helpers.js";
import { articles, articlesFavorited, articleTags, NewArticle, NewArticleTag } from "./models.js";
import { GetAllArticlesParams } from "./schemas.js";

export const insertArticle = async (tx: TransactionType, article: NewArticle) => {
  const result = await tx.insert(articles).values(article).returning();
  return result[0];
};

export const insertArticleTags = async (tx: TransactionType, tags: NewArticleTag[]) => {
  const result = await tx.insert(articleTags).values(tags).returning();
  return result;
};

export const findArticleBySlug = async (slug: string, currentUserId?: string) => {
  const result = await db
    .select({
      author: {
        bio: users.bio,
        following: followingAuthorSq(currentUserId),
        image: users.image,
        username: users.username,
      },
      body: articles.body,
      createdAt: articles.createdAt,
      description: articles.description,
      favorited: favoritedByCurrentUserSq(currentUserId),
      favoritesCount: db.$count(articlesFavorited, eq(articlesFavorited.articleId, articles.id)),
      id: articles.id,
      slug: articles.slug,
      tagList: tagListSq(),
      title: articles.title,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(eq(articles.slug, slug));
  return firstOrUndefined(result);
};

export const findAllArticlesCount = async (filters?: GetAllArticlesParams) => {
  let query = db
    .select({
      count: count(users.id),
    })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .$dynamic();

  if (filters?.author) query = withAuthor(query, filters.author);
  if (filters?.favorited) query = withFavorited(query, filters.favorited);
  if (filters?.tag) query = withTag(query, filters.tag);

  const result = await query;

  return result[0].count;
};

export const findAllArticles = async (filters?: GetAllArticlesParams, currentUserId?: string) => {
  let query = db
    .select({
      author: {
        bio: users.bio,
        following: followingAuthorSq(currentUserId),
        image: users.image,
        username: users.username,
      },
      createdAt: articles.createdAt,
      description: articles.description,
      favorited: favoritedByCurrentUserSq(currentUserId),
      favoritesCount: db.$count(articlesFavorited, eq(articlesFavorited.articleId, articles.id)),
      id: articles.id,
      slug: articles.slug,
      tagList: tagListSq(),
      title: articles.title,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .orderBy(desc(articles.createdAt))
    .limit(filters?.limit ?? 20)
    .offset(filters?.offset ?? 0)
    .$dynamic();

  if (filters?.author) query = withAuthor(query, filters.author);
  if (filters?.favorited) query = withFavorited(query, filters.favorited);
  if (filters?.tag) query = withTag(query, filters.tag);

  const result = await query;
  return result;
};

export const selectFeedArticlesCount = async (currentUserId: string) => {
  const result = await db
    .select({
      count: count(users.id),
    })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .innerJoin(
      profileFollows,
      and(eq(profileFollows.followerId, currentUserId), eq(profileFollows.followeeId, users.id)),
    );

  return result[0].count;
};

export const selectFeedArticles = async (
  currentUserId: string,
  filters?: Pick<GetAllArticlesParams, "limit" | "offset">,
) => {
  const result = await db
    .select({
      author: {
        bio: users.bio,
        following: followingAuthorSq(currentUserId),
        image: users.image,
        username: users.username,
      },
      createdAt: articles.createdAt,
      description: articles.description,
      favorited: favoritedByCurrentUserSq(currentUserId),
      favoritesCount: db.$count(articlesFavorited, eq(articlesFavorited.articleId, articles.id)),
      id: articles.id,
      slug: articles.slug,
      tagList: tagListSq(),
      title: articles.title,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .innerJoin(
      profileFollows,
      and(eq(profileFollows.followerId, currentUserId), eq(profileFollows.followeeId, users.id)),
    )
    .orderBy(desc(articles.createdAt))
    .limit(filters?.limit ?? 20)
    .offset(filters?.offset ?? 0);

  return result;
};

export const selectAllTags = async () => {
  const results = await db
    .selectDistinct({
      tag: articleTags.tag,
    })
    .from(articleTags);

  return results;
};
