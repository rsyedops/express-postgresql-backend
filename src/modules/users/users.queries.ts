import { db } from "#db/index.js";
import { firstOrUndefined } from "#utils/firstOrUndefined.js";
import { eq } from "drizzle-orm";

import { NewUser, users } from "./users.model.js";

export const insertUser = async (user: NewUser) => {
  const [newUser] = await db.insert(users).values(user).returning({
    email: users.email,
    id: users.id,
    username: users.username,
  });

  return newUser;
};

export const findUserByEmail = async (email: string) => {
  const result = await db
    .select({
      email: users.email,
      hashedPassword: users.hashedPassword,
      id: users.id,
      username: users.username,
    })
    .from(users)
    .where(eq(users.email, email));
  return firstOrUndefined(result);
};
