import { pgTable, pgPolicy, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
