import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"HKVO-Leitfaden: Die Heizkostenverordnung einfach erklärt | Heidi Systems",
		description:
			"Pflichten nach der Heizkostenverordnung im Überblick: Verbrauchserfassung, Fernablesbarkeit, monatliche Verbrauchsinformation, Kostenverteilung, CO₂-Kosten und Kürzungsrechte der Mieter. Mit Paragrafen und Schnell-Check.",
		ogTitle: "Die Heizkostenverordnung. Einfach erklärt.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
