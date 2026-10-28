import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import * as schema from "./schema";

let db: ReturnType<typeof createDb> | undefined;

function createDb() {
	if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
	const client = postgres(env.DATABASE_URL, { prepare: false });
	// The query log prints the parameters (emails, the Zählercheck's answers):
	// in development only.
	return drizzle(client, { schema, logger: dev });
}

/** Created on first use, so `vite build` doesn't need `DATABASE_URL`. */
export function getDb() {
	return (db ??= createDb());
}
