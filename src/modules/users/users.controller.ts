import { RequestHandler } from "express";

import { RegisterUserResponse, registerUserSchema } from "./users.schema.js";
import { createUser } from "./users.service.js";

export const createUserHandler: RequestHandler = async (req, res) => {
  const body = registerUserSchema.parse(req.body);

  const newUser = await createUser(body.user);

  return res.status(201).json({
    user: {
      email: newUser.email,
      token: newUser.token,
      username: newUser.username,
    },
  } satisfies RegisterUserResponse);
};
