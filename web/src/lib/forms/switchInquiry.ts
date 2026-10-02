import { z } from "zod";

/**
 * Email signup of the /messdienstwechsel landing page (hero and final CTA),
 * validated in the browser (superforms) and again in the form action.
 */
export const switchInquirySchema = z.object({
	email: z
		.email("Bitte eine gültige E-Mail-Adresse eingeben")
		.max(254, "Bitte eine gültige E-Mail-Adresse eingeben"),
	// Which of the two forms was used, for reporting
	placement: z.enum(["hero", "final"]),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export type SwitchInquiry = z.infer<typeof switchInquirySchema>;
export type SwitchPlacement = SwitchInquiry["placement"];

export const SWITCH_SUCCESS = "Danke! Wir melden uns innerhalb eines Werktags.";
export const SWITCH_ERROR =
	"Das hat leider nicht geklappt. Bitte versuchen Sie es erneut.";
