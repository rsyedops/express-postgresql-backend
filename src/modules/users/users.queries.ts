import { db } from "#db/index.js";

import { NewUser, users } from "./users.model.js";

export const insertUser = async (user: NewUser) => {
  const [newUser] = await db.insert(users).values(user).returning({
    email: users.email,
    username: users.username,
  });

  return newUser;
};
