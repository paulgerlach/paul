import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/interoperabilitaet/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// The business's URL list (url-changes.csv): drafts for the content
		// owner (go-live gate §2).
		title: "Funkzähler aller Hersteller auslesen | Heidi",
		description:
			"Heidi liest Zähler aller Hersteller aus, solange sie funkfähig sind, und erstellt daraus die Heizkostenabrechnung. Kein Austausch nötig.",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
});
