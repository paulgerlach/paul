CREATE TABLE "self_service_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"edit_key_hash" text NOT NULL,
	"offer_number" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"requested_at" timestamp with time zone,
	CONSTRAINT "self_service_results_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "self_service_results" ENABLE ROW LEVEL SECURITY;