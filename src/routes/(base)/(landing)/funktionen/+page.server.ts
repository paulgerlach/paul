import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faqItems } from "$lib/landing/pages/funktionen/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// From url-changes.csv (the business's URL list). Indexed from the
		// start: the page replaces a live URL (plan README, Indexing).
		title: "Funktionen: Funkablesung, Dashboard, Abrechnung | Heidi",
		description:
			"Funkablesung, Dashboard, DocuScan und Heizkostenabrechnung im Überblick. Alle Funktionen der Heidi Plattform für Verwaltungen.",
		ogTitle: "Alle Funktionen. Eine Plattform.",
	},
	landing: DEFAULT_CHROME,
	// The first answer has an expired variant (plan 01 §1.3).
	faq: faqItems(Date.now()),
});
