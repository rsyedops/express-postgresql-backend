import { requireAuthMiddleware } from "#middleware/requireAuth.js";
import express from "express";

import { createArticleHandler } from "./controllers.js";

const router = express.Router();

router.post("/", requireAuthMiddleware, createArticleHandler);

export { router as articlesRouter };
