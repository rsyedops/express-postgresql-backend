CREATE TABLE "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(256) NOT NULL,
	"hashed_password" varchar(256) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" varchar(256) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
