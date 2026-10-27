/**
 * "Word herunterladen", "PDF" and "Text kopieren" on
 * /messdienst-wechseln/muster-kuendigung: the page posts which button
 * worked, and it goes to Make.com (`kuendigungaction`). Only the action and
 * the page: the letter and its fields never leave the browser, and nothing
 * is stored here.
 *
 * Every request gets the same answer: the event is non-essential, so an
 * unknown action or a rate-limited click is dropped quietly.
 */
import { env } from "$env/dynamic/private";
import { ROUTE_MUSTER_KUENDIGUNG } from "$lib/routes";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

const ACTIONS = new Set(["docx", "pdf", "copy"]);

export async function handleKuendigungAction(body: unknown, ip: string) {
	const action =
		body && typeof body === "object" && "action" in body
			? body.action
			: undefined;
	if (typeof action !== "string" || !ACTIONS.has(action)) {
		console.log("[KUENDIGUNGACTION] Dropped: unknown action");
		return;
	}
	// The e2e server (KITCHEN_SINK=1) clicks more often from one IP than a
	// person would.
	const limit = env.KITCHEN_SINK ? 200 : 20;
	if (!checkIPRateLimit(`kdaction:${ip}`, limit, 600).allowed) {
		console.log("[KUENDIGUNGACTION] Dropped: rate limit");
		return;
	}
	// The non-throwing send: a lost click isn't worth an error.
	await sendWebhookEvent("kuendigungaction", null, {
		action,
		page: ROUTE_MUSTER_KUENDIGUNG,
	});
}
