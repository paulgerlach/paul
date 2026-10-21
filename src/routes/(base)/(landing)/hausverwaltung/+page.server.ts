import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq, figures } from "$lib/landing/pages/hausverwaltung/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Messdienst für Hausverwaltungen: Zähler, Ablesung und Heizkostenabrechnung | Heidi Systems",
		description:
			"Heidi übernimmt für Hausverwaltungen Funkzähler, Fernablesung und Heizkostenabrechnung aus einer Hand. Ohne Ablesetermine, mit Verbrauchsinfo für Ihre Mieter und Daten direkt in Ihrer Software.",
		ogTitle: "Messdienst für Hausverwaltungen mit Heidi",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	figures: figures(Date.now()),
});
