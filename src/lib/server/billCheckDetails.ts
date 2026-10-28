/**
 * "Gründe und Details ansehen" on /heizkostenabrechnung-pruefen (it opens
 * the paywall over a result for own values): the page posts how many points
 * the check found, and it goes to Make.com (`billcheckdetails`). Never the
 * bill's values or the result's amount; nothing is stored here.
 *
 * Every request gets the same answer: the event is non-essential, so an
 * invalid body or a rate-limited click is dropped quietly.
 */
import { env } from "$env/dynamic/private";
import { ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN } from "$lib/routes";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

export async function handleBillCheckDetails(body: unknown, ip: string) {
	const points =
		body && typeof body === "object" && "points" in body
			? body.points
			: undefined;
	if (
		typeof points !== "number" ||
		!Number.isInteger(points) ||
		points < 0 ||
		points > 50
	) {
		console.log("[BILLCHECKDETAILS] Dropped: invalid body");
		return;
	}
	// The e2e server (KITCHEN_SINK=1) clicks more often from one IP than a
	// person would.
	const limit = env.KITCHEN_SINK ? 200 : 20;
	if (!checkIPRateLimit(`bcdetails:${ip}`, limit, 600).allowed) {
		console.log("[BILLCHECKDETAILS] Dropped: rate limit");
		return;
	}
	// The non-throwing send: a lost click isn't worth an error.
	await sendWebhookEvent("billcheckdetails", null, {
		points,
		page: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
	});
}
