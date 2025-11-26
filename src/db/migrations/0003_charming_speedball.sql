CREATE TABLE "article_tags" (
	"article_id" uuid NOT NULL,
	"tag" varchar(256) NOT NULL,
	CONSTRAINT "article_tags_article_id_tag_pk" PRIMARY KEY("article_id","tag")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"description" varchar(300) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(100) NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "articles_favorited" (
	"article_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "articles_favorited_article_id_user_id_pk" PRIMARY KEY("article_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles_favorited" ADD CONSTRAINT "articles_favorited_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles_favorited" ADD CONSTRAINT "articles_favorited_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;