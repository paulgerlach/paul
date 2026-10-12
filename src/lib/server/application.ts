/**
 * Application form of /karriere: the empty form for the page load and the
 * form action. Applications go to Make.com (`jobapplication`), which forwards
 * them to the hiring inbox; nothing is stored in our database.
 *
 * Never log the name, link or message. The log lines carry the role only.
 */
import { fail, type RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import {
	message,
	superValidate,
	type SuperValidated,
} from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { applicationSchema, type Application } from "$lib/forms/application";
import { apply, roleLabel } from "$lib/landing/pages/karriere/content";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export type ApplicationMessage = { type: "success" | "error"; text: string };

export async function emptyApplicationForm() {
	const form = await superValidate(zod4(applicationSchema));
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return form;
}

const success = (form: SuperValidated<Application>) =>
	message(form, {
		type: "success",
		text: apply.successText(roleLabel(form.data.role)),
	} satisfies ApplicationMessage);

/** Answers like a success, so bots aren't told what triggered the block. */
function blocked(form: SuperValidated<Application>, reason: string) {
	console.log(`[APPLICATION][SPAM] Blocked: ${reason}`);
	return success(form);
}

export async function handleApplication(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(applicationSchema));
	const { website, _t, role, name, email, link, message: text } = form.data;

	// Honeypot and timing run before validation errors are reported, so a
	// bot that trips one gets the same success answer either way.
	const trap = spamTrapReason({ _hp: website, _t });
	if (trap) return blocked(form, trap);

	if (!form.valid) return fail(400, { form });

	if (isGibberish(name) || (text && isGibberish(text)))
		return blocked(form, `gibberish detected (${role})`);

	// Only valid submissions count, with their own counter. The e2e server
	// (KITCHEN_SINK=1) sends more valid applications from one IP than a
	// person would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 50 : 3;
	if (!checkIPRateLimit(`apply:${ip}`, limit, 600).allowed)
		return blocked(form, `rate limit exceeded for IP: ${ip}`);

	try {
		await sendWebhookEventOrThrow("jobapplication", email, {
			role,
			role_title: roleLabel(role),
			name,
			link: link || undefined,
			message: text || undefined,
			page,
		});
	} catch (error) {
		console.error(`[APPLICATION] Sending failed (${role}):`, error);
		// The visitor sees the fallback address; the form keeps its values.
		return message(
			form,
			{
				type: "error",
				text: `${apply.sendError.before}${apply.fallbackEmail}${apply.sendError.after}`,
			} satisfies ApplicationMessage,
			{ status: 502 },
		);
	}

	console.log(`[APPLICATION] Sent (${role})`);
	return success(form);
}
