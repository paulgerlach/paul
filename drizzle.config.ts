import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read .env itself; variables already set in the shell win
try {
	process.loadEnvFile();
} catch {
	// no .env; rely on the shell environment
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/server/db/schema.ts",
	dialect: "postgresql",
	// Migrations need a direct or session connection (port 5432), not the transaction pooler (6543)
	dbCredentials: { url: process.env.DATABASE_URL },
	schemaFilter: ["public"],
	// Supabase owns its roles (anon, authenticated, service_role …); never create or drop them
	entities: { roles: { provider: "supabase" } },
	introspect: {
		casing: "preserve",
	},
	casing: "snake_case",
});
