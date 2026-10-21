import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq, figures } from "$lib/landing/pages/weg-verwaltung/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heizkostenabrechnung für WEG-Verwaltungen: rechtzeitig vor der ETV | Heidi Systems",
		description:
			"Heidi liefert WEG-Verwaltungen die Heizkostenabrechnung rechtzeitig vor der Eigentümerversammlung, nachvollziehbar für jede Einheit. Der Wechsel des Messdienstes passt zur ETV, mit einer Vollmacht statt vieler Termine.",
		ogTitle: "Heizkostenabrechnung für WEG-Verwaltungen mit Heidi",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	figures: figures(Date.now()),
});
