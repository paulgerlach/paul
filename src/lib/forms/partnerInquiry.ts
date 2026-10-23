import { z } from "zod";

/**
 * Partner form of /partner/installationspartner ("Als Partner melden"), validated in
 * the browser (superforms) and again in the form action.
 *
 * The options are the design's, word for word; the page shows them as they
 * are, and the webhook carries them as chosen. They live here because the
 * schema shouldn't import page content.
 */
export const CREW_SIZES = ["1 bis 2", "3 bis 5", "6 bis 15", "Mehr als 15"];
export const TRADES = ["Heizung", "Sanitär", "Messtechnik", "Elektro"] as const;
export const EXPERIENCE = [
	{ value: "ja", label: "Ja" },
	{ value: "teilweise", label: "Teilweise" },
	{ value: "nein", label: "Noch nicht" },
] as const;

export const PARTNER_ERRORS = {
	company: "Bitte ergänzen Sie den Firmennamen.",
	name: "Bitte ergänzen Sie Ihren Namen.",
	email: "Bitte ergänzen Sie eine gültige E-Mail-Adresse.",
	phone: "Bitte ergänzen Sie eine Telefonnummer.",
	region: "Bitte ergänzen Sie PLZ oder Region.",
	crew: "Bitte wählen Sie die Zahl der Monteure.",
	experience: "Bitte wählen Sie eine der Antworten.",
	message: "Bitte fassen Sie sich etwas kürzer (höchstens 2000 Zeichen).",
	consent: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
};

const text = (min: number, max: number, error: string) =>
	z.string().trim().min(min, error).max(max, error);

// Digits, spaces and + ( ) / -, with at least six digits.
const isPhone = (value: string) =>
	/^\+?[\d\s()/-]+$/.test(value) && value.replace(/\D/g, "").length >= 6;

const experienceValues: string[] = EXPERIENCE.map((e) => e.value);

export const partnerInquirySchema = z.object({
	company: text(2, 200, PARTNER_ERRORS.company),
	name: text(2, 100, PARTNER_ERRORS.name),
	email: z
		.string()
		.trim()
		.max(254, PARTNER_ERRORS.email)
		.pipe(z.email(PARTNER_ERRORS.email)),
	phone: text(6, 40, PARTNER_ERRORS.phone).refine(
		isPhone,
		PARTNER_ERRORS.phone,
	),
	region: text(2, 100, PARTNER_ERRORS.region),
	// A string, not an enum: the select starts on "Bitte wählen" ("").
	crew: z
		.string()
		.refine((value) => CREW_SIZES.includes(value), PARTNER_ERRORS.crew),
	trades: z.array(z.enum(TRADES)).default([]),
	// Optional: no answer is "".
	experience: z
		.string()
		.refine(
			(value) => value === "" || experienceValues.includes(value),
			PARTNER_ERRORS.experience,
		),
	message: z.string().trim().max(2000, PARTNER_ERRORS.message).optional(),
	consent: z.boolean().refine((value) => value, PARTNER_ERRORS.consent),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type PartnerInquiry = z.infer<typeof partnerInquirySchema>;
