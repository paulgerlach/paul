/**
 * Marks the Drizzle baseline migration (0000_leads) as applied, so `drizzle-kit migrate`
 * skips creating the `leads` table that already exists (staging, prod, and a local
 * database built from the Supabase migrations). Idempotent.
 *
 *   DATABASE_URL=<direct connection> bun scripts/db-baseline.ts
 *
 * The bookkeeping matches drizzle-orm's migrator: the hash is the SHA-256 of the
 * migration file, created_at the journal entry's `when`.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import postgres from "postgres";

const BASELINE = "0000_leads";

try {
	process.loadEnvFile();
} catch {
	// no .env; rely on the shell environment
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const journal = JSON.parse(
	readFileSync("drizzle/meta/_journal.json", "utf8"),
) as {
	entries: { tag: string; when: number }[];
};
const entry = journal.entries.find((e) => e.tag === BASELINE);
if (!entry) throw new Error(`${BASELINE} is not in the journal`);
const hash = createHash("sha256")
	.update(readFileSync(`drizzle/${BASELINE}.sql`, "utf8"))
	.digest("hex");

const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
try {
	const host = new URL(url).host;
	const [{ exists }] =
		await sql`select to_regclass('public.leads') is not null as exists`;
	if (!exists)
		throw new Error(
			`public.leads doesn't exist on ${host}; run drizzle-kit migrate instead`,
		);

	await sql`create schema if not exists drizzle`;
	await sql`create table if not exists drizzle.__drizzle_migrations (
		id serial primary key, hash text not null, created_at bigint)`;
	const done =
		await sql`select 1 from drizzle.__drizzle_migrations where hash = ${hash}`;
	if (done.length) {
		console.log(`${BASELINE} already marked as applied on ${host}`);
	} else {
		await sql`insert into drizzle.__drizzle_migrations (hash, created_at) values (${hash}, ${entry.when})`;
		console.log(`${BASELINE} marked as applied on ${host}`);
	}
} finally {
	await sql.end();
}
