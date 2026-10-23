import { z } from "zod";

/**
 * Contact form of /partner/nachfolge ("Gespräch anfragen"), validated in the browser
 * (superforms) and again in the form action.
 *
 * The options are the design's, word for word; the page shows them as they
 * are, and the webhook carries them as chosen. They live here because the
 * schema shouldn't import page content.
 */
export const PROPERTY_COUNTS = [
	"bis 100",
	"100 bis 500",
	"500 bis 2.000",
	"über 2.000",
];
export const TIMEFRAMES = [
	"so bald wie möglich",
	"in 6 bis 12 Monaten",
	"in 1 bis 2 Jahren",
	"noch offen",
];

export const SUCCESSION_ERRORS = {
	company: "Bitte ergänzen Sie den Namen Ihres Unternehmens.",
	name: "Bitte ergänzen Sie Ihren Namen.",
	email: "Bitte ergänzen Sie eine gültige E-Mail-Adresse.",
	phone: "Bitte prüfen Sie die Telefonnummer.",
	properties: "Bitte wählen Sie die Zahl Ihrer Liegenschaften.",
	timeframe: "Bitte wählen Sie einen Zeitraum.",
	message: "Bitte fassen Sie sich etwas kürzer (höchstens 2000 Zeichen).",
	consent: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
};

const text = (min: number, max: number, error: string) =>
	z.string().trim().min(min, error).max(max, error);

// Digits, spaces and + ( ) / -, with at least six digits.
const isPhone = (value: string) =>
	/^\+?[\d\s()/-]+$/.test(value) && value.replace(/\D/g, "").length >= 6;

/** A select the design doesn't require: "Bitte wählen" ("") or one of its options. */
const choice = (options: string[], error: string) =>
	z.string().refine((value) => value === "" || options.includes(value), error);

export const successionInquirySchema = z.object({
	company: text(2, 200, SUCCESSION_ERRORS.company),
	name: text(2, 100, SUCCESSION_ERRORS.name),
	email: z
		.string()
		.trim()
		.max(254, SUCCESSION_ERRORS.email)
		.pipe(z.email(SUCCESSION_ERRORS.email)),
	// Optional (the design doesn't require it): checked only when given.
	phone: z
		.string()
		.trim()
		.max(40, SUCCESSION_ERRORS.phone)
		.refine((value) => value === "" || isPhone(value), SUCCESSION_ERRORS.phone),
	properties: choice(PROPERTY_COUNTS, SUCCESSION_ERRORS.properties),
	timeframe: choice(TIMEFRAMES, SUCCESSION_ERRORS.timeframe),
	message: z.string().trim().max(2000, SUCCESSION_ERRORS.message).optional(),
	consent: z.boolean().refine((value) => value, SUCCESSION_ERRORS.consent),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type SuccessionInquiry = z.infer<typeof successionInquirySchema>;
