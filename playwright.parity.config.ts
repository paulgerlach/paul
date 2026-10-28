import { defineConfig } from "@playwright/test";

// For VERCEL_AUTOMATION_BYPASS_SECRET when BASE_URL is a protected preview.
try {
	process.loadEnvFile();
} catch {
	// no .env
}

// Smoke run: every page of the site answers 200 without console errors.
// Runs against whichever deployment BASE_URL points at:
//   BASE_URL=http://localhost:4173 bunx playwright test -c playwright.parity.config.ts
// No webServer: start the server yourself. Nothing here submits a form.
// A Vercel preview works too: BASE_URL=https://…vercel.app, with
// VERCEL_AUTOMATION_BYPASS_SECRET in .env (see e2e/parity/vercelBypass.ts).
export default defineConfig({
	testDir: "e2e/parity",
	testMatch: "**/*.parity.ts",
	outputDir: "test-results/parity",
	timeout: 120_000,
	workers: 2,
	use: { baseURL: process.env.BASE_URL ?? "http://localhost:5173" },
});
