/**
 * Contact form of /kontakt: the empty form for the page load and the form
 * action. Messages go to Make.com (`contactinquiry`), which forwards them to
 * the topic's mailbox team; nothing is stored in our database. The design
 * posted to a Slack webhook from the browser, which would publish the
 * webhook's URL; the server sends instead.
 *
 * Never log the name, email, phone, company or message. The log lines carry
 * the topic only.
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
	contactInquirySchema,
	mailboxOf,
	type ContactInquiry,
	type ContactMessage,
} from "$lib/forms/contactInquiry";
import { mailboxFor, mailHref } from "$lib/landing/pages/kontakt/mail";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export async function emptyContactForm() {
	const form = await superValidate(zod4(contactInquirySchema));
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

const success = (form: SuperValidated<ContactInquiry>) =>
	message(form, {
		type: "success",
		firstName: form.data.firstName,
		email: form.data.email,
		phone: Boolean(form.data.phone),
		mailto: mailHref(form.data),
	} satisfies ContactMessage);

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<ContactInquiry>, reason: string) {
	console.log(`[KONTAKT][SPAM] Blocked: ${reason}`);
	return success(form);
}

export async function handleContactInquiry(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(contactInquirySchema));
	const { website, _t, topic } = form.data;

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	const data = form.data;
	// Company names may be long single words, so only the names and the
	// message are checked.
	if (
		isGibberish(data.firstName) ||
		isGibberish(data.lastName) ||
		isGibberish(data.message)
	)
		return blocked(form, `gibberish detected (${topic})`);

	// Only valid messages count, with their own counter. The e2e server
	// (KITCHEN_SINK=1) sends more valid messages from one IP than a visitor
	// would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`kontakt:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	try {
		await sendWebhookEventOrThrow("contactinquiry", data.email, {
			topic,
			mailbox: mailboxOf(topic),
			first_name: data.firstName,
			last_name: data.lastName,
			phone: data.phone || undefined,
			company: data.company || undefined,
			units: data.units ? Number(data.units) : undefined,
			message: data.message,
			page,
		});
	} catch (error) {
		console.error(`[KONTAKT] Sending failed (${topic}):`, error);
		// The visitor gets the topic's mailbox; the form keeps its values.
		return message(
			form,
			{
				type: "error",
				mailbox: mailboxFor(topic),
				mailto: mailHref(data),
			} satisfies ContactMessage,
			{ status: 502 },
		);
	}

	console.log(`[KONTAKT] Sent (${topic})`);
	return success(form);
}
