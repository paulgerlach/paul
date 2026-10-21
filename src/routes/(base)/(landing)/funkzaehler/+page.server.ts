import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/funkzaehler/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §3).
		title:
			"Funkzähler: Heizkostenverteiler, Wasserzähler und Rauchwarnmelder | Heidi Systems",
		description:
			"Heizkostenverteiler, Wärme- und Wasserzähler, Rauchwarnmelder und Funk-Gateway von Heidi: fernablesbar, wie ab 1.1.2027 vorgeschrieben, ohne Ablesetermin in der Wohnung.",
		ogTitle: "Funkzähler von Heidi: fernablesbar, ohne Termin in der Wohnung",
		// Until its go-live gate is done (§3).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
});
