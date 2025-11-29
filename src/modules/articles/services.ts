import { db } from "#db/index.js";
import { makeSlug } from "#lib/slugify/makeSlug.js";
import { findUserBy } from "#modules/auth/queries.js";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "#shared/errors.js";

import {
  deleteArticleBySlug,
  deleteArticleFavorite,
  deleteCommentById,
  findAllArticles,
  findAllArticlesCount,
  findArticleBySlug,
  findArticleCommentsBySlug,
  findArticleIdBySlug,
  findCommentById,
  insertArticle,
  insertArticleFavorite,
  insertArticleTags,
  insertComment,
  selectAllTags,
  selectFeedArticles,
  selectFeedArticlesCount,
  updateArticleBySlug,
} from "./queries.js";
import { CreateArticleRequestSchema, GetAllArticlesParams, UpdateArticleRequestSchema } from "./schemas.js";

export const createArticle = async (article: CreateArticleRequestSchema, userId: string) => {
  const author = await findUserBy("id", userId);
  if (!author) throw new UnauthorizedError();

  const slug = makeSlug(article.title);

  // perform insertion as a transaction to ensure both article and tags are added
  return await db.transaction(async (tx) => {
    const newArticle = await insertArticle(tx, {
      authorId: userId,
      body: article.body,
      description: article.description,
      slug,
      title: article.title,
    });

    if (article.tagList?.length)
      await insertArticleTags(
        tx,
        article.tagList.map((tag) => ({
          articleId: newArticle.id,
          tag,
        })),
      );

    return {
      ...newArticle,
      author: { ...author, following: false },
      favorited: false,
      favoritesCount: 0,
      tagList: article.tagList ?? [],
    };
  });
};

export const updateArticle = async (params: UpdateArticleRequestSchema, slug: string, currentUserId: string) => {
  const article = await findArticleBySlug(slug, currentUserId);
  if (!article) throw new NotFoundError(`Article: ${slug} not found`);
  if (article.author.id !== currentUserId) throw new ForbiddenError();

  const newSlug = params.title && params.title !== article.title ? makeSlug(params.title) : undefined;

  const updated = await updateArticleBySlug(
    {
      ...params,
      slug: newSlug,
    },
    slug,
  );

  return {
    ...article,
    ...updated,
  };
};

export const deleteArticle = async (slug: string, currentUserId: string) => {
  const article = await findArticleIdBySlug(slug);
  if (!article) throw new NotFoundError(`Article: ${slug} not found`);
  if (article.authorId !== currentUserId) throw new ForbiddenError();

  return await deleteArticleBySlug(slug);
};

export const getArticle = async (slug: string, currentUserId?: string) => {
  const article = await findArticleBySlug(slug, currentUserId);
  if (!article) throw new NotFoundError(`Article: ${slug} not found`);

  return article;
};

export const getAllArticles = async (params?: GetAllArticlesParams, currentUserId?: string) => {
  let favoritedByUserId: string | undefined = undefined;
  if (params?.favorited) {
    const user = await findUserBy("username", params.favorited);
    if (!user) throw new NotFoundError(`user: ${params.favorited} not found`);
    favoritedByUserId = user.id;
  }

  const filters = { ...params, favorited: favoritedByUserId };

  const articles = await findAllArticles(filters, currentUserId);

  const articlesCount = await findAllArticlesCount(filters);

  return { articles, articlesCount };
};

export const getFeedArticles = async (currentUserId: string, filters?: GetAllArticlesParams) => {
  const articles = await selectFeedArticles(currentUserId, filters);

  const articlesCount = await selectFeedArticlesCount(currentUserId);

  return { articles, articlesCount };
};

export const favoriteArticleBySlug = async (slug: string, currentUserId: string) => {
  const article = await findArticleBySlug(slug, currentUserId);

  if (!article) throw new NotFoundError(`article: ${slug} not found`);

  await insertArticleFavorite({
    articleId: article.id,
    userId: currentUserId,
  });

  return { article: { ...article, favorited: true } };
};

export const unfavoriteArticleBySlug = async (slug: string, currentUserId: string) => {
  const article = await findArticleBySlug(slug, currentUserId);

  if (!article) throw new NotFoundError(`article: ${slug} not found`);

  await deleteArticleFavorite({
    articleId: article.id,
    userId: currentUserId,
  });

  return { article: { ...article, favorited: false } };
};

export const getAllTags = async () => {
  const tags = await selectAllTags();

  return tags.map((item) => item.tag);
};

export const getArticleComments = async (slug: string, currentUserId?: string) => {
  const article = await findArticleIdBySlug(slug);
  if (!article) throw new NotFoundError(`article: ${slug} not found`);

  const result = await findArticleCommentsBySlug(slug, currentUserId);

  return result;
};

export const addCommentToArticle = async (slug: string, body: string, currentUserId: string) => {
  const article = await findArticleIdBySlug(slug);
  if (!article) throw new NotFoundError(`article: ${slug} not found`);

  const author = await findUserBy("id", currentUserId);
  if (!author) throw new UnauthorizedError();

  const comment = await insertComment({
    articleId: article.id,
    authorId: currentUserId,
    body,
  });

  if (!comment) throw new Error(`failed to add comment to ${slug}`);

  return {
    comment: {
      ...comment,
      author: {
        bio: author.bio,
        // self
        following: false,
        image: author.image,
        username: author.username,
      },
    },
  };
};

export const deleteComment = async (slug: string, commentId: string, currentUserId: string) => {
  const comment = await findCommentById(commentId);

  if (comment?.articleSlug !== slug) throw new NotFoundError(`comment: ${commentId} not found`);
  if (comment.authorId !== currentUserId) throw new ForbiddenError();

  const deleted = await deleteCommentById(commentId);
  if (!deleted) throw new Error(`Failed to delete comment: ${commentId}`);

  return deleted;
};
