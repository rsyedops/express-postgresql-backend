CREATE TABLE "profile_follows" (
	"followee_id" uuid NOT NULL,
	"follower_id" uuid NOT NULL,
	CONSTRAINT "profile_follows_follower_id_followee_id_pk" PRIMARY KEY("follower_id","followee_id")
);
--> statement-breakpoint
ALTER TABLE "profile_follows" ADD CONSTRAINT "profile_follows_followee_id_users_id_fk" FOREIGN KEY ("followee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_follows" ADD CONSTRAINT "profile_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;