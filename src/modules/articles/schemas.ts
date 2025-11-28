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

const articleSchema = baseArticleSchema.extend({
  author: profileSchema,
  createdAt: z.date(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  slug: z.string(),
  updatedAt: z.date(),
});

export const articleResponseSchema = z.object({
  article: articleSchema,
});
export type ArticleResponse = z.infer<typeof articleResponseSchema>;

export const getAllArticlesParams = z.object({
  author: z.string().optional(),
  favorited: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  tag: z.string().optional(),
});
export type GetAllArticlesParams = z.infer<typeof getAllArticlesParams>;

export const multipleArticlesResponseSchema = z.object({
  articles: z.array(articleSchema.omit({ body: true })),
  articlesCount: z.number(),
});
export type MultipleArticlesResponse = z.infer<typeof multipleArticlesResponseSchema>;
