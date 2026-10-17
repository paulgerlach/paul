/**
 * Email signup of the landing pages (/messdienstwechsel, /messdienstanbieter
 * and its city pages): empty forms for the page load and the form action.
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
	SWITCH_ERROR,
	SWITCH_SUCCESS,
	switchInquirySchema,
	type SwitchInquiry,
	type SwitchPlacement,
} from "$lib/forms/switchInquiry";
import { spamTrapReason } from "$lib/server/contact";
import { saveLeadDB } from "$lib/server/leads";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

/** A landing page has the same form twice; superforms tells them apart by id. */
export async function emptySwitchForm(placement: SwitchPlacement) {
	const form = await superValidate(zod4(switchInquirySchema), {
		id: placement,
	});
	form.data.placement = placement;
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<SwitchInquiry>, reason: string) {
	console.log(`[SWITCH][SPAM] Blocked: ${reason}`);
	return message(form, { type: "success", text: SWITCH_SUCCESS });
}

export type SwitchSignupOptions = {
	/** Stored with the lead, e.g. "messdienstwechsel". */
	source: string;
	/** Path of the page, sent with the webhook. */
	page: string;
	/** More webhook fields, e.g. `{ city: "berlin" }`. Never from form input. */
	extra?: Record<string, string>;
};

export async function handleSwitchSignup(
	{ request, getClientAddress }: RequestEvent,
	{ source, page, extra }: SwitchSignupOptions,
) {
	const form = await superValidate(request, zod4(switchInquirySchema));
	const { website, _t, email, placement } = form.data;

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	// As in the contact pipeline, only valid submissions count. The counter
	// is separate from the contact form's, and shared by all landing pages:
	// one person signing up on two of them is still one person.
	// The e2e server (KITCHEN_SINK=1) sends more valid signups from one IP
	// than a person would, across all landing pages.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`switch:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	try {
		await saveLeadDB(email, source);
	} catch (error) {
		console.error("[SWITCH] Saving lead failed:", error);
		return message(
			form,
			{ type: "error", text: SWITCH_ERROR },
			{ status: 500 },
		);
	}

	// The lead is stored, so a webhook problem must not fail the request.
	// sendWebhookEvent logs and swallows its own errors.
	await sendWebhookEvent("switchinquiry", email, {
		placement,
		page,
		...extra,
	});

	return message(form, { type: "success", text: SWITCH_SUCCESS });
}
