import { extractAuthToken } from "#utils/extractAuthToken.js";
import { parseAuthenticatedRequest } from "#utils/parseAuthenticatedRequest.js";
import { RequestHandler } from "express";

import { authenticateUserResponse, loginUserSchema, registerUserSchema } from "./schema.js";
import { createUser, getCurrentUser, loginUser } from "./service.js";

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

export const getCurrentUserHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);
  const user = await getCurrentUser(userId);
  const token = extractAuthToken(req);

  return res.json(authenticateUserResponse.parse({ user: { ...user, token } }));
};
