import { requireAuthMiddleware } from "#middleware/requireAuth.js";
import express from "express";

import { createUserHandler, getCurrentUserHandler, loginUserHandler, updateUserHandler } from "./controllers.js";

const router = express.Router();

router.post("/users", createUserHandler);
router.post("/users/login", loginUserHandler);
router.get("/user", requireAuthMiddleware, getCurrentUserHandler);
router.put("/user", requireAuthMiddleware, updateUserHandler);

export { router as AuthRouter };
