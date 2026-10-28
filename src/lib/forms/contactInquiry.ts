import { z } from "zod";

/**
 * Contact form of /kontakt ("Ihre Nachricht an Heidi"), validated in the
 * browser (superforms) and again in the form action.
 *
 * The topics are the design's chips, word for word, each with the mailbox
 * the design sends it to. They live here because the schema shouldn't
 * import page content.
 */
export const MAILBOX_KEYS = ["vertrieb", "info", "presse"] as const;
export type MailboxKey = (typeof MAILBOX_KEYS)[number];

export const CONTACT_TOPICS: { label: string; to: MailboxKey }[] = [
	{ label: "Angebot anfragen", to: "vertrieb" },
	{ label: "Wechsel zu Heidi", to: "vertrieb" },
	{ label: "Ich bin Kunde", to: "info" },
	{ label: "Partnerschaft", to: "vertrieb" },
	{ label: "Presse", to: "presse" },
	{ label: "Sonstiges", to: "info" },
];
const TOPIC_LABELS = CONTACT_TOPICS.map((topic) => topic.label);

/** The default topic (the design's first chip, selected on load). */
export const DEFAULT_TOPIC = TOPIC_LABELS[0];

/** The mailbox of a topic (the design's `data-to`); `vertrieb` if unknown. */
export const mailboxOf = (topic: string): MailboxKey =>
	CONTACT_TOPICS.find((t) => t.label === topic)?.to ?? "vertrieb";

const required = (max: number) => z.string().trim().min(1).max(max);
const optional = (max: number) => z.string().trim().max(max);

/**
 * The design marks the invalid fields and shows one line under the form, so
 * the per-field messages aren't shown; they only mark the field.
 */
export const contactInquirySchema = z.object({
	topic: z
		.string()
		.refine((value) => TOPIC_LABELS.includes(value))
		.default(DEFAULT_TOPIC),
	firstName: required(100),
	lastName: required(100),
	email: z.string().trim().max(254).pipe(z.email()),
	// Optional (the design doesn't check them): only their length.
	phone: optional(40),
	company: optional(200),
	units: z
		.string()
		.trim()
		.refine((value) => /^\d{0,7}$/.test(value)),
	message: required(5000),
	consent: z.boolean().refine((value) => value),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type ContactInquiry = z.infer<typeof contactInquirySchema>;

/**
 * `success`: the done panel ("Danke, <firstName>. … unter <email>"), with
 * the design's "Zusätzlich per E-Mail senden" link. `error`: the line under
 * the form, with the topic's mailbox as a prefilled link.
 */
export type ContactMessage =
	| {
			type: "success";
			firstName: string;
			email: string;
			phone: boolean;
			mailto: string;
	  }
	| { type: "error"; mailbox: string; mailto: string };
