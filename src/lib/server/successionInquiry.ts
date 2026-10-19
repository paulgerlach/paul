/**
 * Contact form of /nachfolge: the empty form for the page load and the form
 * action. Inquiries go to Make.com (`successioninquiry`); nothing is stored
 * in our database. Owners write in confidence, before their customers or
 * staff know.
 *
 * Never log the company, name, email, phone or message. The log lines carry
 * the business size only.
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
	successionInquirySchema,
	type SuccessionInquiry,
} from "$lib/forms/successionInquiry";
import { apply } from "$lib/landing/pages/nachfolge/content";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export type SuccessionMessage = {
	type: "success" | "error";
	text: string;
};

export async function emptySuccessionForm() {
	const form = await superValidate(zod4(successionInquirySchema));
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

const success = (form: SuperValidated<SuccessionInquiry>) =>
	message(form, {
		type: "success",
		text: apply.success(form.data.name),
	} satisfies SuccessionMessage);

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<SuccessionInquiry>, reason: string) {
	console.log(`[NACHFOLGE][SPAM] Blocked: ${reason}`);
	return success(form);
}

export async function handleSuccessionInquiry(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(successionInquirySchema));
	const { website, _t, name, email, message: text } = form.data;
	const size = form.data.properties || "–";

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	// Company names may be long single words, so only the person's name and
	// the message are checked.
	if (isGibberish(name) || (text && isGibberish(text)))
		return blocked(form, `gibberish detected (${size})`);

	// Only valid inquiries count, with their own counter. The e2e server
	// (KITCHEN_SINK=1) sends more valid inquiries from one IP than an owner
	// would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`nachfolge:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	const data = form.data;
	try {
		await sendWebhookEventOrThrow("successioninquiry", email, {
			company: data.company,
			name,
			phone: data.phone || undefined,
			properties: data.properties || undefined,
			timeframe: data.timeframe || undefined,
			message: text || undefined,
			page,
		});
	} catch (error) {
		console.error(`[NACHFOLGE] Sending failed (${size}):`, error);
		// The visitor sees the phone number; the form keeps its values.
		return message(
			form,
			{
				type: "error",
				text: `${apply.sendError.text} ${apply.sendError.phone}`,
			} satisfies SuccessionMessage,
			{ status: 502 },
		);
	}

	console.log(`[NACHFOLGE] Sent (${size})`);
	return success(form);
}
