import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heizkostenabrechnung selbst erstellen: Zählerdaten von Heidi | Heidi Systems",
		description:
			"Sie erstellen die Heizkostenabrechnung selbst, Heidi liefert die Daten: Funkzähler, Fernablesung aller Zähler und Übergabe direkt in Ihr ERP- oder CRM-System.",
		ogTitle: "Sie rechnen ab. Heidi liefert die Daten.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
