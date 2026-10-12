import { z } from "zod";

/**
 * Application form of /karriere, validated in the browser (superforms) and
 * again in the form action.
 *
 * The role ids are the ids of `jobs.list` plus `initiative` in
 * `$lib/landing/pages/karriere/content.ts` (its test keeps them in sync).
 * They live here because the schema shouldn't import page content. The first
 * one is the form's default.
 */
export const ROLE_IDS = ["frontend-engineer", "initiative"] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export const APPLICATION_ERRORS = {
	name: "Bitte ergänzen Sie Ihren Namen.",
	email: "Bitte ergänzen Sie eine gültige E-Mail-Adresse.",
	link: "Bitte geben Sie einen vollständigen Link an (https://…).",
	message: "Bitte fassen Sie sich etwas kürzer (höchstens 2000 Zeichen).",
};

// http(s) only and a real domain: the link ends up in an inbox.
const httpUrl = z.url({ protocol: /^https?$/, hostname: z.regexes.domain });

export const applicationSchema = z.object({
	role: z.enum(ROLE_IDS).default(ROLE_IDS[0]),
	name: z
		.string()
		.trim()
		.min(2, APPLICATION_ERRORS.name)
		.max(100, APPLICATION_ERRORS.name),
	email: z
		.string()
		.trim()
		.max(254, APPLICATION_ERRORS.email)
		.pipe(z.email(APPLICATION_ERRORS.email)),
	// Optional: an empty field is fine, anything else must be a full URL.
	link: z
		.string()
		.trim()
		.max(300, APPLICATION_ERRORS.link)
		.refine(
			(value) => value === "" || httpUrl.safeParse(value).success,
			APPLICATION_ERRORS.link,
		)
		.optional(),
	message: z.string().trim().max(2000, APPLICATION_ERRORS.message).optional(),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type Application = z.infer<typeof applicationSchema>;
