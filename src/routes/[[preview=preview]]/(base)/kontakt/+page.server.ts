import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import {
	CONTACT_ERROR,
	CONTACT_SUCCESS,
	contactFormSchema,
} from "$lib/forms/contact";
import { runContactPipeline } from "$lib/server/contact";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(contactFormSchema));
	// Without JS this render time is what the timing check sees. With JS the
	// form re-stamps it on mount, since the CDN may serve this HTML for minutes.
	form.data._t = Date.now();
	return { form };
};

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const form = await superValidate(request, zod4(contactFormSchema));
		const { website, ...fields } = form.data;

		// The spam layers run before validation errors are reported, so a bot
		// that trips one gets the same success answer either way.
		let result;
		try {
			result = await runContactPipeline(
				{ ...fields, _hp: website },
				getClientAddress(),
			);
		} catch (error) {
			console.error("[CONTACT] Error sending webhook:", error);
			return message(
				form,
				{ type: "error", text: CONTACT_ERROR },
				{ status: 500 },
			);
		}

		if (result === "invalid") {
			// Valid here but not on the server means a length limit was hit
			return form.valid
				? message(form, { type: "error", text: CONTACT_ERROR }, { status: 400 })
				: fail(400, { form });
		}
		return message(form, { type: "success", text: CONTACT_SUCCESS });
	},
};
