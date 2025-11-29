import { db, TransactionType } from "#db/index.js";
import { profileFollows, users } from "#db/schema.js";
import { firstOrUndefined } from "#utils/firstOrUndefined.js";
import { and, count, desc, eq } from "drizzle-orm";

import {
  currentUserfollowingAuthorSq,
  favoritedByCurrentUserSq,
  tagListSq,
  withAuthor,
  withFavorited,
  withPagination,
  withSlug,
  withTag,
} from "./helpers.js";
import {
  articles,
  articlesFavorited,
  articleTags,
  comments,
  NewArticle,
  NewArticleFavorite,
  NewArticleTag,
  NewComment,
} from "./models.js";
import { GetAllArticlesParams } from "./schemas.js";

export const insertArticle = async (tx: TransactionType, article: NewArticle) => {
  const result = await tx.insert(articles).values(article).returning();
  return result[0];
};

export const insertArticleTags = async (tx: TransactionType, tags: NewArticleTag[]) => {
  const result = await tx.insert(articleTags).values(tags).returning();
  return result;
};

export const findArticleIdBySlug = async (slug: string) => {
  const result = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug));
  return firstOrUndefined(result);
};

// shared dynamic query builder
const articleQb = (currentUserId?: string) => {
  return db
    .select({
      author: {
        bio: users.bio,
        following: currentUserfollowingAuthorSq(currentUserId),
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
    .$dynamic();
};

export const findArticleBySlug = async (slug: string, currentUserId?: string) => {
  const query = withSlug(articleQb(currentUserId), slug);

  const result = await query;

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
  let query = articleQb(currentUserId).orderBy(desc(articles.createdAt));

  if (filters?.author) query = withAuthor(query, filters.author);
  if (filters?.favorited) query = withFavorited(query, filters.favorited);
  if (filters?.tag) query = withTag(query, filters.tag);
  query = withPagination(query, filters?.limit, filters?.offset);

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
  let query = articleQb(currentUserId)
    .innerJoin(
      profileFollows,
      and(eq(profileFollows.followerId, currentUserId), eq(profileFollows.followeeId, users.id)),
    )
    .orderBy(desc(articles.createdAt));

  query = withPagination(query, filters?.limit, filters?.offset);

  const result = await query;

  return result;
};

export const insertArticleFavorite = async (favorite: NewArticleFavorite) => {
  return await db.insert(articlesFavorited).values(favorite).onConflictDoNothing();
};

export const deleteArticleFavorite = async (favorite: NewArticleFavorite) => {
  return await db
    .delete(articlesFavorited)
    .where(and(eq(articlesFavorited.articleId, favorite.articleId), eq(articlesFavorited.userId, favorite.userId)));
};

export const selectAllTags = async () => {
  const results = await db
    .selectDistinct({
      tag: articleTags.tag,
    })
    .from(articleTags);

  return results;
};

export const findArticleCommentsBySlug = async (slug: string, currentUserId?: string) => {
  const result = await db
    .select({
      author: {
        bio: users.bio,
        following: currentUserfollowingAuthorSq(currentUserId),
        image: users.image,
        username: users.username,
      },
      body: comments.body,
      createdAt: comments.createdAt,
      id: comments.id,
      updatedAt: comments.updatedAt,
    })
    .from(comments)
    .innerJoin(articles, eq(articles.id, comments.articleId))
    .innerJoin(users, eq(users.id, comments.authorId))
    .where(eq(articles.slug, slug))
    .orderBy(desc(comments.createdAt));

  return result;
};

export const findCommentById = async (commentId: string) => {
  const result = await db
    .select({
      articleSlug: articles.slug,
      authorId: comments.authorId,
    })
    .from(comments)
    .innerJoin(articles, eq(articles.id, comments.articleId))
    .where(eq(comments.id, commentId));

  return firstOrUndefined(result);
};

export const insertComment = async (comment: NewComment) => {
  const result = await db.insert(comments).values(comment).returning({
    body: comments.body,
    createdAt: comments.createdAt,
    id: comments.id,
    updatedAt: comments.updatedAt,
  });

  return firstOrUndefined(result);
};

export const deleteCommentById = async (commentId: string) => {
  const result = await db.delete(comments).where(eq(comments.id, commentId)).returning();
  return firstOrUndefined(result);
};
