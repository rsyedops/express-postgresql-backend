import { parseAuthenticatedRequest } from "#utils/parseAuthenticatedRequest.js";
import { RequestHandler } from "express";

import {
  ArticleResponse,
  articleResponseSchema,
  createArticleRequestSchema,
  createCommentRequestSchema,
  CreateCommentResponse,
  createCommentResponseSchema,
  getAllArticlesParams,
  MultipleArticlesResponse,
  multipleArticlesResponseSchema,
  MultipleCommentsResponse,
  MultipleCommentsResponseSchema,
  updateArticleRequestSchema,
} from "./schemas.js";
import {
  addCommentToArticle,
  createArticle,
  deleteArticle,
  deleteComment,
  favoriteArticleBySlug,
  getAllArticles,
  getAllTags,
  getArticle,
  getArticleComments,
  getFeedArticles,
  unfavoriteArticleBySlug,
  updateArticle,
} from "./services.js";

export const createArticleHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const body = createArticleRequestSchema.parse(req.body);

  const article = await createArticle(body.article, userId);
  const response = articleResponseSchema.parse({ article } satisfies ArticleResponse);

  return res.json(response);
};

export const updateArticleHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const slug = req.params.slug;
  const body = updateArticleRequestSchema.parse(req.body);

  const article = await updateArticle(body.article, slug, userId);

  const response = articleResponseSchema.parse({ article } satisfies ArticleResponse);

  return res.json(response);
};

export const deleteArticleHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const slug = req.params.slug;

  await deleteArticle(slug, userId);

  return res.status(204).end();
};

export const getArticleHandler: RequestHandler = async (req, res) => {
  const userId = parseAuthenticatedRequest(req, false)?.userId;

  const slug = req.params.slug;

  const article = await getArticle(slug, userId);
  const response = articleResponseSchema.parse({ article } satisfies ArticleResponse);

  return res.json(response);
};

export const getAllArticlesHandler: RequestHandler = async (req, res) => {
  const userId = parseAuthenticatedRequest(req, false)?.userId;

  const parsedParams = getAllArticlesParams.safeParse(req.query);
  const params = parsedParams.success ? parsedParams.data : undefined;

  const articles = await getAllArticles(params, userId);
  const response = multipleArticlesResponseSchema.parse(articles satisfies MultipleArticlesResponse);

  return res.json(response);
};

export const getFeedArticlesHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const parsedParams = getAllArticlesParams.safeParse(req.query);
  const params = parsedParams.success ? parsedParams.data : undefined;

  const articles = await getFeedArticles(userId, { limit: params?.limit, offset: params?.offset });
  const response = multipleArticlesResponseSchema.parse(articles satisfies MultipleArticlesResponse);

  return res.json(response);
};

export const favoriteArticleHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const slug = req.params.slug;

  const article = await favoriteArticleBySlug(slug, userId);

  const response = articleResponseSchema.parse({ article } satisfies ArticleResponse);

  return res.json(response);
};

export const unfavoriteArticleHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const slug = req.params.slug;

  const article = await unfavoriteArticleBySlug(slug, userId);

  const response = articleResponseSchema.parse({ article } satisfies ArticleResponse);

  return res.json(response);
};

export const getTagsHandler: RequestHandler = async (_req, res) => {
  const tags = await getAllTags();

  return res.json({ tags } satisfies { tags: string[] });
};

export const getArticleCommentsHandler: RequestHandler = async (req, res) => {
  const userId = parseAuthenticatedRequest(req, false)?.userId;
  const slug = req.params.slug;

  const comments = await getArticleComments(slug, userId);

  const response = MultipleCommentsResponseSchema.parse({ comments } satisfies MultipleCommentsResponse);

  return res.json(response);
};

export const addArticleCommentHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const slug = req.params.slug;
  const { comment } = createCommentRequestSchema.parse(req.body);

  const newComment = await addCommentToArticle(slug, comment.body, userId);

  const response = createCommentResponseSchema.parse(newComment satisfies CreateCommentResponse);

  return res.status(201).json(response);
};

export const deleteCommentHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const { id, slug } = req.params;

  await deleteComment(slug, id, userId);

  return res.status(204).end();
};
