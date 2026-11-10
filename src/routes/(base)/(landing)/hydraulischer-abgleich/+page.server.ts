import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { LAUNCHED } from "$lib/landing/launch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §2).
		title: "Hydraulischer Abgleich nach § 60c GModG | Heidi",
		description:
			"Hydraulischer Abgleich nach § 60c GModG: Pflicht-Check, Anforderungen auf einen Blick und Ablauf. Heidi organisiert den Abgleich für Ihre Liegenschaften, mit raumweiser Heizlastberechnung und schriftlicher Bestätigung.",
		ogTitle: "Jeder Heizkörper bekommt, was er braucht.",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The single time source of the page: SSR renders the days to the § 60b
	// deadline from it, the client clock takes over on mount.
	now: Date.now(),
});
