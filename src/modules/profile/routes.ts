import { optionalAuthMiddleware } from "#middleware/optionalAuth.js";
import { requireAuthMiddleware } from "#middleware/requireAuth.js";
import express from "express";

import { followProfileHandler, getProfileHandler, unfollowProfileHandler } from "./controller.js";

const router = express.Router();

router.get("/:username", optionalAuthMiddleware, getProfileHandler);
router.post("/:username/follow", requireAuthMiddleware, followProfileHandler);
router.delete("/:username/follow", requireAuthMiddleware, unfollowProfileHandler);

export { router as profileRouter };
