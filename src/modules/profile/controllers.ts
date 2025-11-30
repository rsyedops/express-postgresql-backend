import { parseAuthenticatedRequest } from "#utils/parseAuthenticatedRequest.js";
import { RequestHandler } from "express";

import { ProfileResponse, profileResponseSchema } from "./schemas.js";
import { followProfile, getProfile, unfollowProfile } from "./services.js";

export const getProfileHandler: RequestHandler = async (req, res) => {
  const userId = parseAuthenticatedRequest(req, false)?.userId;

  const username = req.params.username;

  const profile = await getProfile(username, userId);

  return res.json(profileResponseSchema.parse({ profile } satisfies ProfileResponse));
};

export const followProfileHandler: RequestHandler = async (req, res) => {
  const userId = parseAuthenticatedRequest(req).userId;

  const username = req.params.username;

  const profile = await followProfile(username, userId);

  return res.json(profileResponseSchema.parse({ profile } satisfies ProfileResponse));
};

export const unfollowProfileHandler: RequestHandler = async (req, res) => {
  const userId = parseAuthenticatedRequest(req).userId;

  const username = req.params.username;

  const profile = await unfollowProfile(username, userId);

  return res.json(profileResponseSchema.parse({ profile } satisfies ProfileResponse));
};
