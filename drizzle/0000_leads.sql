CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"source" text DEFAULT 'chatbot',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable insert for anonymous users" ON "leads" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable read for admin users only" ON "leads" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_admin());