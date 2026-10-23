import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Mieterportal: monatliche Verbrauchsinformation für Ihre Mieter | Heidi Systems",
		description:
			"Im Heidi Mieterportal sehen Ihre Mieter ihren Verbrauch jeden Monat, mit Vergleich zu Vormonat, Vorjahr und Durchschnitt. Nach § 6a HeizkostenV, ohne Aufwand für Ihr Team.",
		ogTitle: "Das Heidi Mieterportal für Ihre Mieter",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
