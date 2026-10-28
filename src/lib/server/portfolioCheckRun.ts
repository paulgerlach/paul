/**
 * "Unterlagen prüfen" on /portfolio-check: the page posts whose files were
 * checked (own or the example) and how many, and it goes to Make.com
 * (`portfoliocheckrun`). Never a file's name or contents ("Ihre Dateien
 * bleiben in Ihrem Browser."); nothing is stored here.
 *
 * Every request gets the same answer: the event is non-essential, so an
 * invalid body or a rate-limited click is dropped quietly.
 */
import { env } from "$env/dynamic/private";
import { ROUTE_PORTFOLIO_CHECKER } from "$lib/routes";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

const MODES = new Set(["own", "example"]);
const count = (n: unknown): n is number =>
	typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 1000;

export async function handlePortfolioCheckRun(body: unknown, ip: string) {
	const { mode, files, ready } = (
		body && typeof body === "object" ? body : {}
	) as { mode?: unknown; files?: unknown; ready?: unknown };
	if (
		typeof mode !== "string" ||
		!MODES.has(mode) ||
		!count(files) ||
		!count(ready) ||
		ready > files
	) {
		console.log("[PORTFOLIOCHECKRUN] Dropped: invalid body");
		return;
	}
	// The e2e server (KITCHEN_SINK=1) checks more often from one IP than a
	// person would.
	const limit = env.KITCHEN_SINK ? 200 : 20;
	if (!checkIPRateLimit(`pcrun:${ip}`, limit, 600).allowed) {
		console.log("[PORTFOLIOCHECKRUN] Dropped: rate limit");
		return;
	}
	// The non-throwing send: a lost click isn't worth an error.
	await sendWebhookEvent("portfoliocheckrun", null, {
		mode,
		files,
		ready,
		page: ROUTE_PORTFOLIO_CHECKER,
	});
}
