import { db } from "#db/index.js";
import { firstOrUndefined } from "#utils/firstOrUndefined.js";
import { eq, getTableColumns } from "drizzle-orm";

import { NewUser, users } from "./model.js";

export const insertUser = async (user: NewUser) => {
  const [newUser] = await db.insert(users).values(user).returning({
    bio: users.bio,
    email: users.email,
    id: users.id,
    image: users.image,
    username: users.username,
  });

  return newUser;
};

export const findUserBy = async (key: "email" | "id" | "username", value: string) => {
  const columns = getTableColumns(users);

  const result = await db
    .select({
      bio: users.bio,
      email: users.email,
      hashedPassword: users.hashedPassword,
      id: users.id,
      image: users.image,
      username: users.username,
    })
    .from(users)
    .where(eq(columns[key], value));
  return firstOrUndefined(result);
};

export const updateUserById = async (id: string, user: Partial<NewUser>) => {
  const result = await db.update(users).set(user).where(eq(users.id, id)).returning({
    bio: users.bio,
    email: users.email,
    image: users.image,
    username: users.username,
  });

  return firstOrUndefined(result);
};
