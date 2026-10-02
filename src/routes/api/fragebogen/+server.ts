import { json } from "@sveltejs/kit";
import { z } from "zod";
import { questionnaireSchema } from "$lib/fragebogen/schema";
import { sendOfferInquiryEvent } from "$lib/server/webhooks";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	try {
		const parsed = questionnaireSchema.safeParse(await request.json());
		if (!parsed.success) {
			console.log(
				"[QUESTIONNAIRE] Validation failed:",
				z.flattenError(parsed.error),
			);
			return json(
				{ error: "Ungültige Eingabe. Bitte überprüfen Sie Ihre Angaben." },
				{ status: 400 },
			);
		}
		const data = parsed.data;

		// Send all questionnaire data to Denis's Make.com workflow
		await sendOfferInquiryEvent(data.email, {
			customer_type: data.customer_type,
			first_name: data.first_name,
			last_name: data.last_name,
			phone: data.phone,
			// Over50 flow fields
			property_count_category: data.property_count_category,
			messdienstleister_count: data.messdienstleister_count,
			zusammenarbeit_status: data.zusammenarbeit_status,
			akuter_handlungsbedarf: data.akuter_handlungsbedarf,
			// Under50 flow fields
			wohnungen_count: data.wohnungen_count,
			funkzaehler_status: data.funkzaehler_status,
			standort_schwerpunkt: data.standort_schwerpunkt,
			// Contact form fields
			verwaltung_name: data.verwaltung_name,
			postleitzahl: data.postleitzahl,
			ort: data.ort,
			// Legacy fields
			appartment_number: data.appartment_number,
			heating_costs: data.heating_costs,
			heating_available: data.heating_available,
			central_water_supply: data.central_water_supply,
			central_heating_system: data.central_heating_system,
			energy_sources: data.energy_sources,
		});
		console.log(`[QUESTIONNAIRE] Sent offer inquiry event for ${data.email}`);

		return json({ success: true });
	} catch (error) {
		console.error("[QUESTIONNAIRE] Error sending webhook:", error);
		return json(
			{ error: "Serverfehler. Bitte erneut versuchen." },
			{ status: 500 },
		);
	}
};
