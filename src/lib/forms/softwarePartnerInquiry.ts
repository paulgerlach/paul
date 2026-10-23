import { z } from "zod";

/**
 * Partner form of /partner/softwarepartner ("Als Partner melden"), validated in the
 * browser (superforms) and again in the form action.
 *
 * The options are the design's, word for word; the page shows them as they
 * are, and the webhook carries them as chosen. They live here because the
 * schema shouldn't import page content.
 */
export const CUSTOMER_COUNTS = [
	"Bis 50",
	"50 bis 250",
	"250 bis 1.000",
	"Mehr als 1.000",
];
export const SOFTWARE_KINDS = [
	"ERP",
	"CRM",
	"Abrechnung",
	"Mieterkommunikation",
	"Sonstiges",
] as const;

export const SOFTWARE_PARTNER_ERRORS = {
	company: "Bitte ergänzen Sie den Namen Ihres Unternehmens.",
	name: "Bitte ergänzen Sie Ihren Namen.",
	email: "Bitte ergänzen Sie eine gültige E-Mail-Adresse.",
	phone: "Bitte prüfen Sie die Telefonnummer.",
	product: "Bitte ergänzen Sie Ihre Software oder Ihr Produkt.",
	customers: "Bitte wählen Sie die Zahl Ihrer Kunden.",
	message: "Bitte fassen Sie sich etwas kürzer (höchstens 2000 Zeichen).",
	consent: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
};

const text = (min: number, max: number, error: string) =>
	z.string().trim().min(min, error).max(max, error);

// Digits, spaces and + ( ) / -, with at least six digits.
const isPhone = (value: string) =>
	/^\+?[\d\s()/-]+$/.test(value) && value.replace(/\D/g, "").length >= 6;

export const softwarePartnerInquirySchema = z.object({
	company: text(2, 200, SOFTWARE_PARTNER_ERRORS.company),
	name: text(2, 100, SOFTWARE_PARTNER_ERRORS.name),
	email: z
		.string()
		.trim()
		.max(254, SOFTWARE_PARTNER_ERRORS.email)
		.pipe(z.email(SOFTWARE_PARTNER_ERRORS.email)),
	// Optional (the design doesn't require it): checked only when given.
	phone: z
		.string()
		.trim()
		.max(40, SOFTWARE_PARTNER_ERRORS.phone)
		.refine(
			(value) => value === "" || isPhone(value),
			SOFTWARE_PARTNER_ERRORS.phone,
		),
	product: text(2, 200, SOFTWARE_PARTNER_ERRORS.product),
	// A string, not an enum: the select starts on "Bitte wählen" ("").
	customers: z
		.string()
		.refine(
			(value) => CUSTOMER_COUNTS.includes(value),
			SOFTWARE_PARTNER_ERRORS.customers,
		),
	kinds: z.array(z.enum(SOFTWARE_KINDS)).default([]),
	message: z
		.string()
		.trim()
		.max(2000, SOFTWARE_PARTNER_ERRORS.message)
		.optional(),
	consent: z
		.boolean()
		.refine((value) => value, SOFTWARE_PARTNER_ERRORS.consent),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type SoftwarePartnerInquiry = z.infer<
	typeof softwarePartnerInquirySchema
>;
