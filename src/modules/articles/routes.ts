import { optionalAuthMiddleware } from "#middleware/optionalAuth.js";
import { requireAuthMiddleware } from "#middleware/requireAuth.js";
import express from "express";

import {
  addArticleCommentHandler,
  createArticleHandler,
  deleteArticleHandler,
  deleteCommentHandler,
  favoriteArticleHandler,
  getAllArticlesHandler,
  getArticleCommentsHandler,
  getArticleHandler,
  getFeedArticlesHandler,
  unfavoriteArticleHandler,
  updateArticleHandler,
} from "./controllers.js";

const router = express.Router();

router.get("/feed", requireAuthMiddleware, getFeedArticlesHandler);
router.get("/:slug/comments", optionalAuthMiddleware, getArticleCommentsHandler);
router.get("/:slug", optionalAuthMiddleware, getArticleHandler);
router.get("/", optionalAuthMiddleware, getAllArticlesHandler);
router.post("/:slug/comments", requireAuthMiddleware, addArticleCommentHandler);
router.post("/:slug/favorite", requireAuthMiddleware, favoriteArticleHandler);
router.post("/", requireAuthMiddleware, createArticleHandler);
router.put("/:slug", requireAuthMiddleware, updateArticleHandler);
router.delete("/:slug/favorite", requireAuthMiddleware, unfavoriteArticleHandler);
router.delete("/:slug/comments/:id", requireAuthMiddleware, deleteCommentHandler);
router.delete("/:slug", requireAuthMiddleware, deleteArticleHandler);

export { router as articlesRouter };
