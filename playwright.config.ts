import { defineConfig } from "@playwright/test";

const WEBHOOK_SINK = "http://127.0.0.1:4199";
// The e2e server uses the local Supabase stack (`bun run db:start`): its
// DATABASE_URL, SUPABASE_URL and SUPABASE_SECRET_KEY come from the shell or
// .env (`bunx supabase status` prints the key). Both URLs must be local, so
// the tests never write to staging or prod.
try {
	process.loadEnvFile();
} catch {
	// no .env; rely on the shell environment
}
const isLocal = (url = "") =>
	/^\w+:\/\/([^@/]*@)?(127\.0\.0\.1|localhost)[:/]/.test(url);
for (const name of ["DATABASE_URL", "SUPABASE_URL"])
	if (!isLocal(process.env[name]))
		throw new Error(
			`${name} must point at the local Supabase stack for the e2e tests`,
		);
if (!process.env.SUPABASE_SECRET_KEY)
	throw new Error("SUPABASE_SECRET_KEY is not set (bunx supabase status)");

export default defineConfig({
	webServer: [
		{
			command: "bun e2e/webhook-sink.ts",
			url: `${WEBHOOK_SINK}/events`,
		},
		{
			command: "bun run build && bun run preview",
			port: 4173,
			// Webhooks go to the local sink, never to the real Make.com scenario.
			// KITCHEN_SINK=1 raises the forms' per-IP rate limits (the name is
			// from the removed /kitchen-sink page).
			env: {
				KITCHEN_SINK: "1",
				MAKE_WEBHOOK_UNIFIED: WEBHOOK_SINK,
			},
		},
	],
	// Set explicitly: Playwright only derives it from a single webServer.
	use: { baseURL: "http://localhost:4173" },
	testDir: "e2e",
	testMatch: "**/*.e2e.{ts,js}",
});
