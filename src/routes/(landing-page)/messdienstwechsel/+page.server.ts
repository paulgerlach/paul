import { fail } from "@sveltejs/kit";
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
import { ROUTE_MESSDIENSTWECHSEL } from "$lib/routes";
import type { Actions, PageServerLoad } from "./$types";

const LEAD_SOURCE = "messdienstwechsel";

/** The page has the same form twice; superforms tells them apart by id. */
async function emptyForm(placement: SwitchPlacement) {
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

export const load: PageServerLoad = async () => ({
	seo: {
		title: "Messdienstleister wechseln | Heidi Systems",
		description:
			"Sie schicken uns Ihren Vertrag, Heidi erledigt den Rest. Auch mit laufendem Vertrag: Wir werten Ihre bestehenden Zähler sofort aus.",
		ogTitle: "Messdienstleister wechseln. So einfach wie nie.",
	},
	heroForm: await emptyForm("hero"),
	finalForm: await emptyForm("final"),
});

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const form = await superValidate(request, zod4(switchInquirySchema));
		const { website, _t, email, placement } = form.data;

		// Honeypot and timing run before validation errors are reported, so a
		// bot that trips one gets the same success answer either way.
		const trap = spamTrapReason({ _hp: website, _t });
		if (trap) return blocked(form, trap);

		if (!form.valid) return fail(400, { form });

		// As in the contact pipeline, only valid submissions count. The counter
		// is separate, so the signup doesn't use up the contact form's quota.
		const ip = getClientAddress();
		if (!checkIPRateLimit(`switch:${ip}`, 3, 600).allowed)
			return blocked(form, `rate limit exceeded for IP: ${ip}`);

		try {
			await saveLeadDB(email, LEAD_SOURCE);
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
			page: ROUTE_MESSDIENSTWECHSEL,
		});

		return message(form, { type: "success", text: SWITCH_SUCCESS });
	},
};
