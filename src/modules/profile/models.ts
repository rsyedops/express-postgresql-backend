import { users } from "#db/schema.js";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

export const profileFollows = pgTable(
  "profile_follows",
  {
    followeeId: uuid("followee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.followerId, table.followeeId] })],
);
