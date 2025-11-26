import { parseAuthenticatedRequest } from "#utils/parseAuthenticatedRequest.js";
import { RequestHandler } from "express";

import { articleResponseSchema, createArticleRequestSchema } from "./schemas.js";
import { createArticle } from "./services.js";

export const createArticleHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);

  const body = createArticleRequestSchema.parse(req.body);

  const article = await createArticle(body.article, userId);

  res.json(articleResponseSchema.parse({ article }));
};
