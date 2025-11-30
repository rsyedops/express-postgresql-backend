import { extractAuthToken } from "#utils/extractAuthToken.js";
import { parseAuthenticatedRequest } from "#utils/parseAuthenticatedRequest.js";
import { RequestHandler } from "express";

import {
  AuthenticateUserResponse,
  authenticateUserResponseSchema,
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "./schemas.js";
import { createUser, getCurrentUser, loginUser, updateUser } from "./services.js";

export const createUserHandler: RequestHandler = async (req, res) => {
  const body = registerUserSchema.parse(req.body);

  const user = await createUser(body.user);

  return res.status(201).json(authenticateUserResponseSchema.parse({ user } satisfies AuthenticateUserResponse));
};

export const loginUserHandler: RequestHandler = async (req, res) => {
  const body = loginUserSchema.parse(req.body);

  const user = await loginUser(body.user);

  return res.json(authenticateUserResponseSchema.parse({ user } satisfies AuthenticateUserResponse));
};

export const getCurrentUserHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);
  const user = await getCurrentUser(userId);
  const token = extractAuthToken(req);

  return res.json(
    authenticateUserResponseSchema.parse({ user: { ...user, token } } satisfies AuthenticateUserResponse),
  );
};

export const updateUserHandler: RequestHandler = async (req, res) => {
  const { userId } = parseAuthenticatedRequest(req);
  const body = updateUserSchema.parse(req.body);
  const token = extractAuthToken(req);

  const user = await updateUser(userId, body.user);

  return res.json(
    authenticateUserResponseSchema.parse({ user: { ...user, token } } satisfies AuthenticateUserResponse),
  );
};
