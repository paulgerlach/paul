import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read .env itself
try {
	process.loadEnvFile();
} catch {
	// no .env; rely on the shell environment
}

export default defineConfig({
	out: "./src/lib/server/db",
	schema: "./src/lib/server/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		database: "postgres",
		port: Number(process.env.DB_PORT) || 54322,
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	},
	schemaFilter: ["public"],
	introspect: {
		casing: "preserve",
	},
	casing: "snake_case",
});
