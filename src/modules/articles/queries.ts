import { TransactionType } from "#db/index.js";

import { articles, articleTags, NewArticle, NewArticleTag } from "./models.js";

export const insertArticle = async (tx: TransactionType, article: NewArticle) => {
  const result = await tx.insert(articles).values(article).returning();
  return result[0];
};

export const insertArticleTags = async (tx: TransactionType, tags: NewArticleTag[]) => {
  const result = await tx.insert(articleTags).values(tags).returning();
  return result;
};
