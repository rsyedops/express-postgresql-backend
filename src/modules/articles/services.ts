import { db } from "#db/index.js";
import { makeSlug } from "#lib/slugify/makeSlug.js";
import { findUserBy } from "#modules/auth/queries.js";

import { insertArticle, insertArticleTags } from "./queries.js";
import { CreateArticleRequestSchema } from "./schemas.js";

export const createArticle = async (article: CreateArticleRequestSchema, userId: string) => {
  const author = await findUserBy("id", userId);

  const slug = makeSlug(article.title);

  // perform insertion as a transaction to ensure both article and tags are added
  return await db.transaction(async (tx) => {
    const newArticle = await insertArticle(tx, {
      authorId: userId,
      body: article.body,
      description: article.description,
      slug,
      title: article.title,
    });

    if (article.tagList?.length)
      await insertArticleTags(
        tx,
        article.tagList.map((tag) => ({
          articleId: newArticle.id,
          tag,
        })),
      );

    return {
      ...newArticle,
      author: { ...author, following: false },
      favorited: false,
      favoritesCount: 0,
      tagList: article.tagList ?? [],
    };
  });
};
