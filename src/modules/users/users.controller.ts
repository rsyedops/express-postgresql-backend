import { RequestHandler } from "express";

import { authenticateUserResponse, loginUserSchema, registerUserSchema } from "./users.schema.js";
import { createUser, loginUser } from "./users.service.js";

export const createUserHandler: RequestHandler = async (req, res) => {
  const body = registerUserSchema.parse(req.body);

  const user = await createUser(body.user);

  return res.status(201).json(authenticateUserResponse.parse({ user }));
};

export const loginUserHandler: RequestHandler = async (req, res) => {
  const body = loginUserSchema.parse(req.body);

  const user = await loginUser(body.user);

  return res.json(authenticateUserResponse.parse({ user }));
};
