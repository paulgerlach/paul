import { defineConfig } from "@playwright/test";

// For VERCEL_AUTOMATION_BYPASS_SECRET when BASE_URL is a protected preview.
try {
	process.loadEnvFile();
} catch {
	// no .env
}

// Phase 10 parity suite. Runs against whichever app BASE_URL points at:
//   BASE_URL=http://localhost:3000 bunx playwright test -c playwright.parity.config.ts --update-snapshots  (Next baseline)
//   BASE_URL=http://localhost:5173 bunx playwright test -c playwright.parity.config.ts                     (Svelte)
// No webServer: start both dev servers yourself. Nothing here submits a form.
// A Vercel preview works too: BASE_URL=https://…vercel.app, with
// VERCEL_AUTOMATION_BYPASS_SECRET in .env (see e2e/parity/vercelBypass.ts).
export default defineConfig({
	testDir: "e2e/parity",
	testMatch: "**/*.parity.ts",
	// One baseline file per page and width, shared by both apps (no per-platform suffix).
	snapshotPathTemplate: "e2e/parity/__screenshots__/{arg}{ext}",
	outputDir: "test-results/parity",
	timeout: 120_000,
	workers: 2,
	use: { baseURL: process.env.BASE_URL ?? "http://localhost:5173" },
	expect: {
		toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
	},
});
