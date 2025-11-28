import { optionalAuthMiddleware } from "#middleware/optionalAuth.js";
import { requireAuthMiddleware } from "#middleware/requireAuth.js";
import express from "express";

import {
  createArticleHandler,
  favoriteArticleHandler,
  getAllArticlesHandler,
  getArticleHandler,
  getFeedArticlesHandler,
  unfavoriteArticleHandler,
} from "./controllers.js";

const router = express.Router();

router.post("/:slug/favorite", requireAuthMiddleware, favoriteArticleHandler);
router.delete("/:slug/favorite", requireAuthMiddleware, unfavoriteArticleHandler);
router.post("/", requireAuthMiddleware, createArticleHandler);
router.get("/feed", requireAuthMiddleware, getFeedArticlesHandler);
router.get("/:slug", optionalAuthMiddleware, getArticleHandler);
router.get("/", optionalAuthMiddleware, getAllArticlesHandler);

export { router as articlesRouter };
