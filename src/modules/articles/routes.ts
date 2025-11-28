import { optionalAuthMiddleware } from "#middleware/optionalAuth.js";
import { requireAuthMiddleware } from "#middleware/requireAuth.js";
import express from "express";

import { createArticleHandler, getAllArticlesHandler, getArticleHandler } from "./controllers.js";

const router = express.Router();

router.post("/", requireAuthMiddleware, createArticleHandler);
router.get("/:slug", optionalAuthMiddleware, getArticleHandler);
router.get("/", optionalAuthMiddleware, getAllArticlesHandler);

export { router as articlesRouter };
