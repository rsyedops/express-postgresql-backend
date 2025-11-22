import express from "express";

import { createUserHandler } from "./users.controller.js";

const router = express.Router();

router.post("/", createUserHandler);

export { router as usersRouter };
