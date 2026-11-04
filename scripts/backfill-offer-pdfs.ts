/**
 * Makes the offer PDFs for stored Zählercheck results that have none: rows
 * from before the PDFs existed (no `data.documents`) and rows whose PDFs
 * failed (an empty list). Each row's PDFs are made from its stored state with
 * the same code as a live send (`storeDocuments`), written to the bucket
 * `self-service` and recorded in `data.documents`; nothing else in the row
 * changes and Make.com isn't told. Rows that got PDFs meanwhile are skipped,
 * so it can run again.
 *
 *   DATABASE_URL=<pooler, port 5432> SUPABASE_URL=<api url> \
 *   SUPABASE_SECRET_KEY=<secret key> bun scripts/backfill-offer-pdfs.ts [--apply]
 *
 * Without `--apply` it only lists the rows. All three variables must come from
 * the shell: the module code runs through Vite, which would otherwise take
 * them from `.env` (staging).
 */
import postgres from "postgres";
import { createServer } from "vite";

const apply = process.argv.includes("--apply");
const missing = ["DATABASE_URL", "SUPABASE_URL", "SUPABASE_SECRET_KEY"].filter(
	(k) => !process.env[k],
);
if (missing.length)
	throw new Error(`Set ${missing.join(", ")} in the shell (not only in .env)`);

const dbUrl = process.env.DATABASE_URL!;
console.log(
	`Database ${new URL(dbUrl).host}, storage ${new URL(process.env.SUPABASE_URL!).host}${apply ? "" : " (dry run)"}`,
);

const sql = postgres(dbUrl, { prepare: false, max: 1, onnotice: () => {} });
// Vite loads the app's modules ($lib, $env, ?raw / ?inline imports).
const vite = await createServer({
	server: { middlewareMode: true, hmr: false, ws: false },
	appType: "custom",
	logLevel: "error",
});

type Row = { id: string; offer_number: string; data: { state: unknown } };

try {
	const rows = await sql<Row[]>`
		select id, offer_number, data from self_service_results
		where coalesce(jsonb_array_length(data->'documents'), 0) = 0
		order by created_at`;
	console.log(`${rows.length} offer(s) without PDFs`);
	if (!apply || !rows.length) {
		for (const r of rows) console.log(`  ${r.offer_number} (${r.id})`);
	} else {
		const { storeDocuments } = (await vite.ssrLoadModule(
			"$lib/server/selfServiceOffer",
		)) as typeof import("../src/lib/server/selfServiceOffer");
		const { selfServiceStateSchema } = (await vite.ssrLoadModule(
			"$lib/forms/selfServiceOffer",
		)) as typeof import("../src/lib/forms/selfServiceOffer");

		let done = 0;
		let failed = 0;
		for (const r of rows) {
			const parsed = selfServiceStateSchema.safeParse(r.data.state);
			const s = parsed.success ? parsed.data : null;
			if (!s?.ang) {
				console.log(
					`  ${r.offer_number}: no readable offer in its state, skipped`,
				);
				failed++;
				continue;
			}
			const documents = await storeDocuments(r.id, s, s.ang, "backfill");
			if (!documents.length) {
				console.log(`  ${r.offer_number}: making the PDFs failed`);
				failed++;
				continue;
			}
			// Only the documents; a send in between may have set them already.
			const updated = await sql`
				update self_service_results
				set data = jsonb_set(data, '{documents}', ${sql.json(documents)})
				where id = ${r.id}
					and coalesce(jsonb_array_length(data->'documents'), 0) = 0
				returning id`;
			console.log(
				`  ${r.offer_number}: ${updated.length ? documents.map((d) => d.path).join(", ") : "got PDFs meanwhile, left alone"}`,
			);
			done += updated.length;
		}
		console.log(`${done} updated, ${failed} failed`);
		if (failed) process.exitCode = 1;
	}
} finally {
	await sql.end();
	await vite.close();
}
// The app's modules leave handles open (Vite's watchers, keep-alive sockets).
process.exit();
