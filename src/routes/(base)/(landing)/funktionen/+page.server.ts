import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faqItems } from "$lib/landing/pages/funktionen/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4). Indexed from the start: the
		// page replaces a live URL (plan README, Indexing).
		title:
			"Funktionen: Funkzähler, Dashboard und Heizkostenabrechnung | Heidi Systems",
		description:
			"Fernablesbare Funkzähler, alle Verbräuche je Wohnung im Dashboard und die Heizkostenabrechnung nach HKVO. Von der Installation bis zur fertigen Abrechnung aus einer Hand.",
		ogTitle: "Daten mit höchster Effizienz bearbeiten.",
	},
	landing: DEFAULT_CHROME,
	// The first answer has an expired variant (plan 01 §1.3).
	faq: faqItems(Date.now()),
});
