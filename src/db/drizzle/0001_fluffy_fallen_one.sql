CREATE TABLE "users_in_auth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
DROP POLICY "Users can insert/update/delete their posts" ON "posts" CASCADE;--> statement-breakpoint
DROP POLICY "Users can read their posts" ON "posts" CASCADE;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users1_id_fkey";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
CREATE POLICY "User can manage own profile" ON "users" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = id));