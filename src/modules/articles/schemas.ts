import { profileSchema } from "#modules/profile/schema.js";
import z from "zod";

const baseArticleSchema = z.object({
  body: z.string(),
  description: z.string().max(300, "Description must be <= 300 chatacters "),
  tagList: z.array(z.string()).optional(),
  title: z.string().max(100, "Title must be <= 100 characters"),
});
export const createArticleRequestSchema = z.object({
  article: baseArticleSchema,
});
export type CreateArticleRequestSchema = z.infer<typeof createArticleRequestSchema>["article"];

export const articleResponseSchema = z.object({
  article: baseArticleSchema.extend({
    author: profileSchema,
    createdAt: z.date(),
    favorited: z.boolean(),
    favoritesCount: z.number(),
    slug: z.string(),
    updatedAt: z.date(),
  }),
});
