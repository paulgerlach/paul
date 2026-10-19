/**
 * Partner form of /softwarepartner: the empty form for the page load and the
 * form action. Inquiries go to Make.com (`softwarepartnerinquiry`); nothing
 * is stored in our database.
 *
 * Never log the company, name, email, phone, product or message. The log
 * lines carry the customer count only.
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
	softwarePartnerInquirySchema,
	type SoftwarePartnerInquiry,
} from "$lib/forms/softwarePartnerInquiry";
import { apply } from "$lib/landing/pages/softwarepartner/content";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export type SoftwarePartnerMessage = {
	type: "success" | "error";
	text: string;
};

export async function emptySoftwarePartnerForm() {
	const form = await superValidate(zod4(softwarePartnerInquirySchema));
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

const success = (form: SuperValidated<SoftwarePartnerInquiry>) =>
	message(form, {
		type: "success",
		text: apply.success(form.data.name),
	} satisfies SoftwarePartnerMessage);

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<SoftwarePartnerInquiry>, reason: string) {
	console.log(`[SOFTWAREPARTNER][SPAM] Blocked: ${reason}`);
	return success(form);
}

export async function handleSoftwarePartnerInquiry(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(softwarePartnerInquirySchema));
	const { website, _t, customers, name, email, message: text } = form.data;

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	// Company and product names may be long single words, so only the
	// person's name and the message are checked.
	if (isGibberish(name) || (text && isGibberish(text)))
		return blocked(form, `gibberish detected (${customers})`);

	// Only valid inquiries count, with their own counter. The e2e server
	// (KITCHEN_SINK=1) sends more valid inquiries from one IP than a vendor
	// would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`softwarepartner:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	const data = form.data;
	try {
		await sendWebhookEventOrThrow("softwarepartnerinquiry", email, {
			company: data.company,
			name,
			phone: data.phone || undefined,
			product: data.product,
			customers,
			kinds: data.kinds,
			message: text || undefined,
			page,
		});
	} catch (error) {
		console.error(`[SOFTWAREPARTNER] Sending failed (${customers}):`, error);
		// The visitor sees the phone number; the form keeps its values.
		return message(
			form,
			{
				type: "error",
				text: `${apply.sendError.text} ${apply.sendError.phone}`,
			} satisfies SoftwarePartnerMessage,
			{ status: 502 },
		);
	}

	console.log(`[SOFTWAREPARTNER] Sent (${customers})`);
	return success(form);
}
