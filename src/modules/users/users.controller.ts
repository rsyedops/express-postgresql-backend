import { RequestHandler } from "express";

import { registerUserSchema } from "./users.schema.js";
import { createUser } from "./users.service.js";

export const createUserHandler: RequestHandler = async (req, res) => {
  const user = registerUserSchema.parse(req.body);

  const newUser = await createUser(user);

  return res.status(201).json({
    user: newUser,
  });
};
