/**
 * The Zählercheck's first "Weiter" on /self-service (once per visit, when it
 * moves on): the page posts the step it left and the answer to "Liegt eine
 * Heizkostenabrechnung vor?", and it goes to Make.com (`selfservicestart`).
 * Nothing personal; nothing is stored here.
 *
 * Every request gets the same answer: the event is non-essential, so an
 * invalid body or a rate-limited click is dropped quietly.
 */
import { env } from "$env/dynamic/private";
import { ROUTE_SELF_SERVICE } from "$lib/routes";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

const STEP =
	/^(abr|liste|bestand|geraete|heiz|einheiten|dev:[a-z]{2,8}|mont|zusatz|kontakt|res|adr)$/;
const BILL = new Set(["ja", "nein", ""]);

export async function handleSelfServiceStart(body: unknown, ip: string) {
	const { step, bill } = (body && typeof body === "object" ? body : {}) as {
		step?: unknown;
		bill?: unknown;
	};
	if (
		typeof step !== "string" ||
		!STEP.test(step) ||
		typeof bill !== "string" ||
		!BILL.has(bill)
	) {
		console.log("[SELFSERVICESTART] Dropped: invalid body");
		return;
	}
	// The e2e server (KITCHEN_SINK=1) starts more often from one IP than a
	// person would.
	const limit = env.KITCHEN_SINK ? 200 : 20;
	if (!checkIPRateLimit(`ssstart:${ip}`, limit, 600).allowed) {
		console.log("[SELFSERVICESTART] Dropped: rate limit");
		return;
	}
	// The non-throwing send: a lost start isn't worth an error.
	await sendWebhookEvent("selfservicestart", null, {
		step,
		...(bill && { bill }),
		page: ROUTE_SELF_SERVICE,
	});
}
