import express from "express";

import { createUserHandler, loginUserHandler } from "./users.controller.js";

const router = express.Router();

router.post("/", createUserHandler);
router.post("/login", loginUserHandler);

export { router as usersRouter };
