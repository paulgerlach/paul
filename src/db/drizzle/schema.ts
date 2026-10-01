import { pgTable, pgPolicy, uuid, timestamp, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const leads = pgTable("leads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	source: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Enable insert for anonymous users", {
		as: "permissive",
		for: "insert",
		to: ["anon", "public"],
		using: sql`true`
	}),
	pgPolicy("Enable read for admin users only", {
		as: "restrictive",
		for: "select",
		to: ["authenticated"],
		using: sql`auth.role() = 'admin'`
	}),
])
