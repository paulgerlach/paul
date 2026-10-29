/**
 * "Jetzt bestellen" on /energieausweis: the page posts which offer's order
 * page was opened, and it goes to Make.com (`energieausweisorder`) with the
 * offer's title, tier and price from the page's content. Nothing is stored
 * here and nothing personal is sent or logged.
 *
 * Every request gets the same answer: the event is non-essential, so an
 * unknown offer or a rate-limited click is dropped quietly.
 */
import { env } from "$env/dynamic/private";
import { offers } from "$lib/landing/pages/energieausweis/content";
import { ROUTE_ENERGIEAUSWEIS } from "$lib/routes";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

export async function handleEnergieausweisOrder(body: unknown, ip: string) {
	const id =
		body && typeof body === "object" && "offer" in body
			? body.offer
			: undefined;
	const offer = offers.items.find((item) => item.id === id);
	if (!offer) {
		console.log("[ENERGIEAUSWEISORDER] Dropped: unknown offer");
		return;
	}
	// The e2e server (KITCHEN_SINK=1) clicks more often from one IP than a
	// person would.
	const limit = env.KITCHEN_SINK ? 200 : 20;
	if (!checkIPRateLimit(`eaorder:${ip}`, limit, 600).allowed) {
		console.log("[ENERGIEAUSWEISORDER] Dropped: rate limit");
		return;
	}
	// The non-throwing send: a lost click isn't worth an error.
	await sendWebhookEvent("energieausweisorder", null, {
		offer: offer.id,
		title: offer.title,
		tier: offer.tier,
		price: offer.price,
		page: ROUTE_ENERGIEAUSWEIS,
	});
}
