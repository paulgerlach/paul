import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (ongoing-tasks/go-live-gates.md §1).
		title: "Allgemeine Geschäftsbedingungen (AGB) | Heidi Systems",
		description:
			"Die AGB der Heidi Systems GmbH für den Abrechnungsservice sowie die Vermietung von Geräten zur Verbrauchserfassung und von Rauchwarnmeldern.",
		// Until its go-live gate is done. Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
