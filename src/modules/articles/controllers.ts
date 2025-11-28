import { parseAuthenticatedRequest } from "#utils/parseAuthenticatedRequest.js";
import { RequestHandler } from "express";

import {
  ArticleResponse,
  articleResponseSchema,
  createArticleRequestSchema,
  getAllArticlesParams,
  MultipleArticlesResponse,
  multipleArticlesResponseSchema,
} from "./schemas.js";
import { createArticle, getAllArticles, getArticle, getFeedArticles } from "./services.js";

export const createArticleHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const body = createArticleRequestSchema.parse(req.body);

  const article = await createArticle(body.article, userId);
  const response = articleResponseSchema.parse({ article } satisfies ArticleResponse);

  res.json(response);
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
