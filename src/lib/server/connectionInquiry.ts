/**
 * The form "Anbindung anfragen" in /partnerschaften's first audience card:
 * the empty form for the page load and the form action (`?/connection`).
 * Inquiries go to Make.com (`connectioninquiry`); nothing is stored in our
 * database.
 *
 * Never log the company, name, email or message. The log lines carry the
 * kind of software only.
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
	connectionInquirySchema,
	type ConnectionInquiry,
} from "$lib/forms/connectionInquiry";
import { connection } from "$lib/landing/pages/partnerschaften/content";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export type ConnectionMessage = {
	type: "success" | "error";
	text: string;
};

/** The superforms id: the page has a second form, the contact form. */
const ID = "connection";

export async function emptyConnectionForm() {
	const form = await superValidate(zod4(connectionInquirySchema), { id: ID });
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

/** The page shows its thank-you panel for it. */
const success = (form: SuperValidated<ConnectionInquiry>) =>
	message(form, {
		type: "success",
		text: connection.done.title,
	} satisfies ConnectionMessage);

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<ConnectionInquiry>, reason: string) {
	console.log(`[ANBINDUNG][SPAM] Blocked: ${reason}`);
	return success(form);
}

export async function handleConnectionInquiry(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(connectionInquirySchema), {
		id: ID,
	});
	const { website, _t, name, email, message: text } = form.data;
	const kind = form.data.software || "–";

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	// Company names may be long single words, so only the person's name and
	// the message are checked.
	if (isGibberish(name) || (text && isGibberish(text)))
		return blocked(form, `gibberish detected (${kind})`);

	// Only valid inquiries count, with their own counter (not the page's
	// contact form's). The e2e server (KITCHEN_SINK=1) sends more valid
	// inquiries from one IP than a vendor would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`anbindung:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	const data = form.data;
	try {
		await sendWebhookEventOrThrow("connectioninquiry", email, {
			company: data.company,
			name,
			software: data.software,
			message: text || undefined,
			page,
		});
	} catch (error) {
		console.error(`[ANBINDUNG] Sending failed (${kind}):`, error);
		// The visitor sees the phone number; the form keeps its values.
		return message(
			form,
			{
				type: "error",
				text: `${connection.sendError.text} ${connection.sendError.phone}`,
			} satisfies ConnectionMessage,
			{ status: 502 },
		);
	}

	console.log(`[ANBINDUNG] Sent (${kind})`);
	return success(form);
}
