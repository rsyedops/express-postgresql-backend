import { users } from "#db/schema.js";
import { pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  body: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  description: varchar("description", { length: 300 }).notNull(),
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  title: varchar("title", { length: 100 }).notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type NewArticle = typeof articles.$inferInsert;

export const articleTags = pgTable(
  "article_tags",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tag: varchar("tag", { length: 256 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.tag] })],
);
export type NewArticleTag = typeof articleTags.$inferInsert;

export const articlesFavorited = pgTable(
  "articles_favorited",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.userId] })],
);
export type NewArticleFavorite = typeof articlesFavorited.$inferInsert;
