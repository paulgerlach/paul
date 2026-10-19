import { z } from "zod";

/**
 * The small form "Anbindung anfragen" in /partnerschaften's first audience
 * card ("Sie sind Softwareanbieter?"), validated in the browser
 * (superforms) and again in the form action.
 *
 * The options are the design's, word for word; the page shows them as they
 * are, and the webhook carries them as chosen. They live here because the
 * schema shouldn't import page content.
 */
export const SOFTWARE_TYPES = [
	"ERP für die Immobilienwirtschaft",
	"CRM",
	"Abrechnungssoftware",
	"Mieter-App oder Portal",
	"Andere Software",
];

export const CONNECTION_ERRORS = {
	company: "Bitte ergänzen Sie den Namen Ihres Unternehmens.",
	name: "Bitte ergänzen Sie Ihren Namen.",
	email: "Bitte ergänzen Sie eine gültige E-Mail-Adresse.",
	software: "Bitte wählen Sie Ihre Software.",
	message: "Bitte fassen Sie sich etwas kürzer (höchstens 2000 Zeichen).",
	consent: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
};

const text = (min: number, max: number, error: string) =>
	z.string().trim().min(min, error).max(max, error);

export const connectionInquirySchema = z.object({
	company: text(2, 200, CONNECTION_ERRORS.company),
	name: text(2, 100, CONNECTION_ERRORS.name),
	email: z
		.string()
		.trim()
		.max(254, CONNECTION_ERRORS.email)
		.pipe(z.email(CONNECTION_ERRORS.email)),
	// A string, not an enum: the select starts on "Bitte wählen" ("").
	software: z
		.string()
		.refine(
			(value) => SOFTWARE_TYPES.includes(value),
			CONNECTION_ERRORS.software,
		),
	message: z.string().trim().max(2000, CONNECTION_ERRORS.message).optional(),
	consent: z.boolean().refine((value) => value, CONNECTION_ERRORS.consent),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type ConnectionInquiry = z.infer<typeof connectionInquirySchema>;
