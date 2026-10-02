import { defineConfig } from "@playwright/test";

export default defineConfig({
	webServer: {
		command: "bun run build && bun run preview",
		port: 4173,
		env: { KITCHEN_SINK: "1" },
	},
	testDir: "e2e",
	testMatch: "**/*.e2e.{ts,js}",
});
