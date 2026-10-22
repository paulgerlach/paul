/**
 * The offer of /self-service's Zählercheck: `/api/self-service` receives the
 * wizard's state when the offer is made (`created`) and when the visitor asks
 * for it by email (`requested`), and sends it to Make.com
 * (`selfserviceoffer`), which forwards it to sales; nothing is stored here.
 * The design posted to a Slack webhook from the browser, which would publish
 * the webhook's URL; the server sends instead, and builds the text itself
 * from the validated state.
 *
 * Never log the name, email, phone, company or address. The log lines carry
 * the stage only.
 */
import { env } from "$env/dynamic/private";
import { z } from "zod";
import { selfServiceOfferSchema } from "$lib/forms/selfServiceOffer";
import {
	billingLines,
	calc,
	offerDates,
	offerSummary,
	positions,
	propertyLines,
	validate,
} from "$lib/landing/pages/self-service/wizard/model";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

/** "sent", or "blocked" (answered like a success), "invalid", "failed". */
export type OfferResult = "sent" | "blocked" | "invalid" | "failed";

const HEADS = {
	created:
		":page_facing_up: *Neues Angebot aus dem Self-Service (noch nicht angefordert)*",
	requested: (mail: string) =>
		`:email: *Angebot per E-Mail angefordert, bitte PDF an ${mail} senden*`,
};

function blocked(reason: string): OfferResult {
	console.log(`[SELF-SERVICE][SPAM] Blocked: ${reason}`);
	return "blocked";
}

export async function handleSelfServiceOffer(
	body: unknown,
	ip: string,
	page: string,
): Promise<OfferResult> {
	const raw = (body ?? {}) as Record<string, unknown>;
	const trap = spamTrapReason({ _hp: raw.website, _t: raw._t });
	if (trap) return blocked(trap);

	const parsed = selfServiceOfferSchema.safeParse(body);
	if (!parsed.success) {
		console.log(
			"[SELF-SERVICE] Validation failed:",
			z.flattenError(parsed.error).fieldErrors,
		);
		return "invalid";
	}
	const { stage, state: s, files } = parsed.data;
	// The wizard only makes an offer with a contact and an address.
	if (
		!s.ang ||
		validate("kontakt", s, () => 0) ||
		validate("adr", s, () => 0)
	) {
		console.log(`[SELF-SERVICE] Incomplete offer (${stage})`);
		return "invalid";
	}
	if (isGibberish(s.k.vn) || isGibberish(s.k.nn))
		return blocked(`gibberish detected (${stage})`);

	// Two sends per offer; the e2e server (KITCHEN_SINK=1) sends more.
	const limit = env.KITCHEN_SINK ? 100 : 10;
	if (!checkIPRateLimit(`self-service:${ip}`, limit, 600).allowed)
		return blocked(`rate limit exceeded for IP: ${ip}`);

	const mail = s.k.mail.trim();
	const offer = s.ang;
	const c = calc(s);
	const p = positions(c);
	try {
		await sendWebhookEventOrThrow("selfserviceoffer", mail, {
			stage,
			offer_number: offer.nr,
			object_id: offer.id,
			valid_until: offerDates(offer).valid,
			first_name: s.k.vn.trim(),
			last_name: s.k.nn.trim(),
			company: s.k.firma.trim() || undefined,
			phone: s.k.tel.trim() || undefined,
			property: propertyLines(s).join(", "),
			billing: billingLines(s).join(", "),
			units: c.units || undefined,
			once_net: p.sO,
			yearly_net: p.year,
			files,
			text: offerSummary(
				s,
				offer,
				stage === "created" ? HEADS.created : HEADS.requested(mail),
				files,
			),
			page,
		});
	} catch (error) {
		console.error(`[SELF-SERVICE] Sending failed (${stage}):`, error);
		return "failed";
	}
	console.log(`[SELF-SERVICE] Sent (${stage})`);
	return "sent";
}
