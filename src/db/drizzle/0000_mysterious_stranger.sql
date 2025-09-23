-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
	"last_name" text,
	"email" text
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" text,
	"content" text,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now())
);
--> statement-breakpoint
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users1_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Users can access their own record" ON "users" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = id));--> statement-breakpoint
CREATE POLICY "Users can insert/update/delete their posts" ON "posts" AS PERMISSIVE FOR ALL TO public USING ((user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "Users can read their posts" ON "posts" AS PERMISSIVE FOR SELECT TO public;
*/