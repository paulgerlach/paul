import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/asset-manager/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Verbrauchsdaten für Asset Manager und Fonds: das ganze Portfolio auf einen Blick | Heidi Systems",
		description:
			"Heidi liefert Asset Managern und Fonds eine einheitliche Datenbasis über alle Objekte und Verwaltungen: fernablesbare Zähler, monatliche Verbräuche und Abrechnungen nach HKVO in einem Dashboard.",
		ogTitle: "Verbräuche im ganzen Portfolio. Auf einen Blick.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
});
