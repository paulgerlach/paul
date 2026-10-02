import { z } from "zod";

/**
 * Fragebogen fields and validation. Shared by the wizard (phase 7) and
 * `/api/fragebogen`, so the server checks exactly what the client does (KI-16).
 */
export const questionnaireSchema = z.object({
	// Step 0: Customer type
	customer_type: z
		.enum([
			"Privatperson",
			"Hausverwaltung",
			"Assetmanager, Fonds & Bestandshalter",
		])
		.nullable(),

	// Step 1: Property count category (determines flow)
	property_count_category: z
		.enum(["1-50 Immobilien", "51-800 Immobilien", "über 800 Immobilien"])
		.nullable(),

	// Over50 Flow (51-800 & über 800 Immobilien) fields
	messdienstleister_count: z.number().min(1).optional(),
	zusammenarbeit_status: z
		.enum(["Sehr zufrieden", "Teils / teils", "Stark unzufrieden"])
		.nullable()
		.optional(),
	akuter_handlungsbedarf: z.enum(["Ja", "Nein"]).nullable().optional(),

	// Under50 Flow (1-50 Immobilien) fields
	wohnungen_count: z.number().min(1).optional(),
	funkzaehler_status: z.enum(["Ja", "Nein"]).nullable().optional(),
	standort_schwerpunkt: z.string().optional().or(z.literal("")),

	// Contact form fields (Q5 - Location)
	verwaltung_name: z.string().optional().or(z.literal("")),
	postleitzahl: z.string().optional().or(z.literal("")),
	ort: z.string().optional().or(z.literal("")),

	// Contact form fields (Q6 - Personal)
	phone: z
		.string()
		.transform((val) => val.replace(/[\s-]/g, ""))
		.refine((val) => /^\+?[0-9]\d{1,14}$/.test(val), {
			message: "Bitte geben Sie eine gültige Telefonnummer ein",
		}),
	email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
	first_name: z.string().min(1, "Bitte füllen Sie dieses Feld aus"),
	last_name: z.string().min(1, "Bitte füllen Sie dieses Feld aus"),
	form_confirm: z.boolean().refine((val) => val === true, {
		message: "Bitte akzeptieren Sie die Datenschutzbestimmungen",
	}),
	// Legacy fields (kept for backwards compatibility, will be removed after full migration)
	appartment_number: z
		.number()
		.min(1, "Wohnungsnummer ist erforderlich")
		.optional(),
	heating_costs: z
		.enum([
			"Durch mich persönlich",
			"Durch einen anderen Messdienstleister",
			"Bisher noch gar nicht",
		])
		.nullable()
		.optional(),
	heating_available: z.enum(["Ja", "Nein"]).nullable().optional(),
	central_water_supply: z.enum(["Ja", "Nein"]).nullable().optional(),
	central_heating_system: z
		.enum([
			"Nur Heizkörper",
			"Nur Fußbodenheizung",
			"Heizkörper und Fußbodenheizung",
		])
		.nullable()
		.optional(),
	energy_sources: z.string().nullable().optional(),
});

/** What the wizard holds while it's being filled in (before the phone transform). */
export type QuestionnaireInput = z.input<typeof questionnaireSchema>;
/** What `/api/fragebogen` receives after validation. */
export type QuestionnaireData = z.output<typeof questionnaireSchema>;

/**
 * Starting values for the wizard (KI-17). Next defined these three times; this
 * is the react-hook-form `defaultValues` set, the one Next actually submitted.
 * `phone` had no RHF default, but its input registered an empty string.
 */
export const questionnaireDefaults: QuestionnaireInput = {
	customer_type: null,
	property_count_category: null,
	// Over50 Flow fields
	messdienstleister_count: 10,
	zusammenarbeit_status: null,
	akuter_handlungsbedarf: null,
	// Under50 Flow fields
	wohnungen_count: 3,
	funkzaehler_status: null,
	standort_schwerpunkt: "",
	// Contact form fields (Q5 - Location)
	verwaltung_name: "",
	postleitzahl: "",
	ort: "",
	// Contact form fields (Q6 - Personal)
	phone: "",
	email: "",
	first_name: "",
	last_name: "",
	form_confirm: false,
	// Legacy fields
	appartment_number: 2,
	heating_costs: null,
	heating_available: null,
	central_water_supply: null,
	central_heating_system: null,
	energy_sources: "Fernwärme",
};
