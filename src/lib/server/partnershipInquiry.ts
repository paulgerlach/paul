/**
 * Contact form of /partnerschaften ("Partnerschaft anfragen"): the empty
 * form for the page load and the form action (`?/partnership`). Inquiries go
 * to Make.com (`partnershipinquiry`); nothing is stored in our database.
 *
 * Never log the company, name, email, phone or message. The log lines carry
 * the kind of partnership only.
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
	partnershipInquirySchema,
	type PartnershipInquiry,
} from "$lib/forms/partnershipInquiry";
import { apply } from "$lib/landing/pages/partnerschaften/content";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export type PartnershipMessage = {
	type: "success" | "error";
	text: string;
};

/** The superforms id: the page has a second form (`connectionInquiry.ts`). */
const ID = "partnership";

export async function emptyPartnershipForm() {
	const form = await superValidate(zod4(partnershipInquirySchema), { id: ID });
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

const success = (form: SuperValidated<PartnershipInquiry>) =>
	message(form, {
		type: "success",
		text: apply.success(form.data.name),
	} satisfies PartnershipMessage);

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<PartnershipInquiry>, reason: string) {
	console.log(`[PARTNERSCHAFTEN][SPAM] Blocked: ${reason}`);
	return success(form);
}

export async function handlePartnershipInquiry(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(partnershipInquirySchema), {
		id: ID,
	});
	const { website, _t, name, email, message: text } = form.data;
	const kind = form.data.kind || "–";

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	// Company names may be long single words, so only the person's name and
	// the message are checked.
	if (isGibberish(name) || (text && isGibberish(text)))
		return blocked(form, `gibberish detected (${kind})`);

	// Only valid inquiries count, with their own counter. The e2e server
	// (KITCHEN_SINK=1) sends more valid inquiries from one IP than a partner
	// would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`partnerschaften:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	const data = form.data;
	try {
		await sendWebhookEventOrThrow("partnershipinquiry", email, {
			company: data.company,
			name,
			phone: data.phone || undefined,
			kind: data.kind,
			message: text || undefined,
			page,
		});
	} catch (error) {
		console.error(`[PARTNERSCHAFTEN] Sending failed (${kind}):`, error);
		// The visitor sees the phone number; the form keeps its values.
		return message(
			form,
			{
				type: "error",
				text: `${apply.sendError.text} ${apply.sendError.phone}`,
			} satisfies PartnershipMessage,
			{ status: 502 },
		);
	}

	console.log(`[PARTNERSCHAFTEN] Sent (${kind})`);
	return success(form);
}
