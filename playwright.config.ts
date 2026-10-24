import { defineConfig } from "@playwright/test";

const WEBHOOK_SINK = "http://127.0.0.1:4199";

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
			env: { KITCHEN_SINK: "1", MAKE_WEBHOOK_UNIFIED: WEBHOOK_SINK },
		},
	],
	// Set explicitly: Playwright only derives it from a single webServer.
	use: { baseURL: "http://localhost:4173" },
	testDir: "e2e",
	testMatch: "**/*.e2e.{ts,js}",
});
