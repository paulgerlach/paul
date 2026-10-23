import { z } from "zod";

/**
 * Contact form of /partner ("Partnerschaft anfragen"), validated in
 * the browser (superforms) and again in the form action.
 *
 * The options are the design's, word for word; the page shows them as they
 * are, and the webhook carries them as chosen. They live here because the
 * schema shouldn't import page content.
 */
export const PARTNERSHIP_KINDS = [
	"Softwareanbieter",
	"Installationsbetrieb",
	"Verband oder Netzwerk",
	"Messdienstanbieter",
	"Immobilienunternehmen",
	"Sonstiges",
];

export const PARTNERSHIP_ERRORS = {
	company: "Bitte ergänzen Sie den Namen Ihres Unternehmens.",
	name: "Bitte ergänzen Sie Ihren Namen.",
	email: "Bitte ergänzen Sie eine gültige E-Mail-Adresse.",
	phone: "Bitte prüfen Sie die Telefonnummer.",
	kind: "Bitte wählen Sie die Art der Partnerschaft.",
	message: "Bitte fassen Sie sich etwas kürzer (höchstens 2000 Zeichen).",
	consent: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
};

const text = (min: number, max: number, error: string) =>
	z.string().trim().min(min, error).max(max, error);

// Digits, spaces and + ( ) / -, with at least six digits.
const isPhone = (value: string) =>
	/^\+?[\d\s()/-]+$/.test(value) && value.replace(/\D/g, "").length >= 6;

export const partnershipInquirySchema = z.object({
	company: text(2, 200, PARTNERSHIP_ERRORS.company),
	name: text(2, 100, PARTNERSHIP_ERRORS.name),
	email: z
		.string()
		.trim()
		.max(254, PARTNERSHIP_ERRORS.email)
		.pipe(z.email(PARTNERSHIP_ERRORS.email)),
	// Optional (the design doesn't require it): checked only when given.
	phone: z
		.string()
		.trim()
		.max(40, PARTNERSHIP_ERRORS.phone)
		.refine(
			(value) => value === "" || isPhone(value),
			PARTNERSHIP_ERRORS.phone,
		),
	// A string, not an enum: the select starts on "Bitte wählen" ("").
	kind: z
		.string()
		.refine(
			(value) => PARTNERSHIP_KINDS.includes(value),
			PARTNERSHIP_ERRORS.kind,
		),
	message: z.string().trim().max(2000, PARTNERSHIP_ERRORS.message).optional(),
	consent: z.boolean().refine((value) => value, PARTNERSHIP_ERRORS.consent),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type PartnershipInquiry = z.infer<typeof partnershipInquirySchema>;
