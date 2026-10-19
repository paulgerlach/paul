/**
 * Partner form of /installationspartner: the empty form for the page load
 * and the form action. Inquiries go to Make.com (`partnerinquiry`); nothing
 * is stored in our database.
 *
 * Never log the company, name, email, phone, region or message. The log
 * lines carry the crew size only.
 */
import { fail, type RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import {
	message,
	superValidate,
	type SuperValidated,
} from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import {
	partnerInquirySchema,
	type PartnerInquiry,
} from "$lib/forms/partnerInquiry";
import { apply } from "$lib/landing/pages/installationspartner/content";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export type PartnerMessage = { type: "success" | "error"; text: string };

export async function emptyPartnerForm() {
	const form = await superValidate(zod4(partnerInquirySchema));
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

const success = (form: SuperValidated<PartnerInquiry>) =>
	message(form, {
		type: "success",
		text: apply.success(form.data.name),
	} satisfies PartnerMessage);

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<PartnerInquiry>, reason: string) {
	console.log(`[PARTNER][SPAM] Blocked: ${reason}`);
	return success(form);
}

export async function handlePartnerInquiry(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(partnerInquirySchema));
	const { website, _t, crew, name, email, message: text } = form.data;

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	// Company names may be long single words, so only the person's name and
	// the message are checked.
	if (isGibberish(name) || (text && isGibberish(text)))
		return blocked(form, `gibberish detected (${crew})`);

	// Only valid inquiries count, with their own counter. The e2e server
	// (KITCHEN_SINK=1) sends more valid inquiries from one IP than a company
	// would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`partner:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	const data = form.data;
	try {
		await sendWebhookEventOrThrow("partnerinquiry", email, {
			company: data.company,
			name,
			phone: data.phone,
			region: data.region,
			crew,
			trades: data.trades,
			experience: data.experience || undefined,
			message: text || undefined,
			page,
		});
	} catch (error) {
		console.error(`[PARTNER] Sending failed (${crew}):`, error);
		// The visitor sees the phone number; the form keeps its values.
		return message(
			form,
			{
				type: "error",
				text: `${apply.sendError.text} ${apply.sendError.phone}`,
			} satisfies PartnerMessage,
			{ status: 502 },
		);
	}

	console.log(`[PARTNER] Sent (${crew})`);
	return success(form);
}
