import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 256 }).notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  username: varchar("username", { length: 256 }).notNull().unique(),
});
export type NewUser = typeof users.$inferInsert;
export type User = Pick<typeof users.$inferSelect, "email" | "username">;
