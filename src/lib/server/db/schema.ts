import {
	pgTable,
	pgPolicy,
	uuid,
	timestamp,
	text,
	jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { SelfServiceRecord } from "$lib/forms/selfServiceOffer";

// As it exists on staging and prod (baseline 0000_leads); public.is_admin() comes from the Supabase baseline migration
export const leads = pgTable(
	"leads",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		email: text().notNull(),
		source: text().default("chatbot"),
		created_at: timestamp({ mode: "string" }).defaultNow(),
	},
	() => [
		pgPolicy("Enable insert for anonymous users", {
			as: "permissive",
			for: "insert",
			to: ["anon"],
			withCheck: sql`true`,
		}),
		pgPolicy("Enable read for admin users only", {
			as: "permissive",
			for: "select",
			to: ["authenticated"],
			using: sql`public.is_admin()`,
		}),
	],
);

// The Zählercheck's offers on /self-service, one row per offer: `token` is the
// secret in the result page's URL (/self-service-result/<token>), which only
// shows it; the visitor's browser updates the row with its own key
// (`edit_key_hash`, SHA-256). `data` holds the answers as asked, the raw
// state and the uploaded files (bucket `self-service`, under `<id>/`). Only
// the server reads and writes it, so RLS is on without a policy.
export const selfServiceResults = pgTable("self_service_results", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	token: text().notNull().unique(),
	edit_key_hash: text().notNull(),
	offer_number: text().notNull(),
	data: jsonb().$type<SelfServiceRecord>().notNull(),
	created_at: timestamp({ withTimezone: true, mode: "string" })
		.defaultNow()
		.notNull(),
	updated_at: timestamp({ withTimezone: true, mode: "string" })
		.defaultNow()
		.notNull(),
	requested_at: timestamp({ withTimezone: true, mode: "string" }),
}).enableRLS();
