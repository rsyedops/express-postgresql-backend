import { profileSchema } from "#modules/profile/schemas.js";
import z from "zod";

const baseArticleSchema = z.object({
  body: z.string().min(1, "body is required"),
  description: z.string().min(1, "description is required").max(300, "description must be <= 300 chatacters "),
  tagList: z.array(z.string()).optional(),
  title: z.string().min(1, "title is required").max(100, "title must be <= 100 characters"),
});
export const createArticleRequestSchema = z.object({
  article: baseArticleSchema,
});
export type CreateArticleRequestSchema = z.infer<typeof createArticleRequestSchema>["article"];

export const updateArticleRequestSchema = z.object({
  article: baseArticleSchema.omit({ tagList: true }).partial(),
});
export type UpdateArticleRequestSchema = z.infer<typeof updateArticleRequestSchema>["article"];

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

export const baseCommentSchema = z.object({
  author: profileSchema,
  body: z.string(),
  createdAt: z.date(),
  id: z.uuid(),
  updatedAt: z.date(),
});
export const createCommentRequestSchema = z.object({
  comment: z.object({
    body: z.string(),
  }),
});
export const createCommentResponseSchema = z.object({
  comment: baseCommentSchema,
});
export type CreateCommentResponse = z.infer<typeof createCommentResponseSchema>;
export const MultipleCommentsResponseSchema = z.object({
  comments: z.array(baseCommentSchema),
});
export type MultipleCommentsResponse = z.infer<typeof MultipleCommentsResponseSchema>;
