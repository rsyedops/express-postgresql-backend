import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  bio: varchar("bio", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 256 }).notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  image: text(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  username: varchar("username", { length: 256 }).notNull().unique(),
});
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
