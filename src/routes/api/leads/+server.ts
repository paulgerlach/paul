import { json } from "@sveltejs/kit";
import { z } from "zod";
import { saveLeadDB } from "$lib/server/leads";
import type { RequestHandler } from "./$types";

// KI-16: Next inserted whatever it was sent
const leadSchema = z.object({
	email: z.email().max(254),
	source: z.string().max(100).optional(),
});

/** Chat widget email capture. */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const parsed = leadSchema.safeParse(await request.json());
		if (!parsed.success) {
			return json(
				{ error: "Ungültige Eingabe. Bitte überprüfen Sie Ihre Angaben." },
				{ status: 400 },
			);
		}

		await saveLeadDB(parsed.data.email, parsed.data.source);

		return json({ success: true });
	} catch (error) {
		console.error("[LEADS] Error saving lead:", error);
		return json(
			{ error: "Serverfehler. Bitte erneut versuchen." },
			{ status: 500 },
		);
	}
};
