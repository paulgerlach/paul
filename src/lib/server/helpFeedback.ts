/**
 * "War das hilfreich?" on /hilfe: the form action. The page posts with
 * SvelteKit's `enhance` (or plainly, without JS) and reads only the message. A vote goes to Make.com (`helpfeedback`); nothing is stored
 * here and nothing personal is sent or logged.
 *
 * Every request gets the same success: the vote is non-essential, so an
 * invalid, rate-limited or lost one still thanks the visitor.
 */
import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import {
	helpFeedbackSchema,
	type HelpFeedbackMessage,
} from "$lib/forms/helpFeedback";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

export async function handleHelpFeedback(
	{ request, getClientAddress }: RequestEvent,
	{ page }: { page: string },
) {
	const form = await superValidate(request, zod4(helpFeedbackSchema), {
		id: "help-feedback",
	});
	const thanks = (question?: string) =>
		message(form, { type: "success", question } satisfies HelpFeedbackMessage);

	if (!form.valid) {
		console.log("[HELPFEEDBACK] Dropped: invalid vote");
		// A success to the browser too, without validation errors to show.
		form.valid = true;
		form.errors = {};
		return thanks();
	}

	const { question, vote } = form.data;
	// The e2e server (KITCHEN_SINK=1) votes more often from one IP than a
	// person would.
	const ip = getClientAddress();
	const limit = env.KITCHEN_SINK ? 200 : 20;
	if (!checkIPRateLimit(`helpfb:${ip}`, limit, 600).allowed) {
		console.log("[HELPFEEDBACK] Dropped: rate limit");
		return thanks(question);
	}

	// The non-throwing send: a lost vote isn't worth an error.
	await sendWebhookEvent("helpfeedback", null, { question, vote, page });
	return thanks(question);
}
