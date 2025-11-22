import { requireAuthMiddleware } from "#middleware/requireAuth.js";
import express from "express";

import { createUserHandler, getCurrentUserHandler, loginUserHandler } from "./controller.js";

const router = express.Router();

router.post("/users", createUserHandler);
router.post("/users/login", loginUserHandler);
router.get("/user", requireAuthMiddleware, getCurrentUserHandler);

export { router as AuthRouter };
