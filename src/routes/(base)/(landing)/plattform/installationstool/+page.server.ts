import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/installationstool/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heidi Installationstool: Zähler tauschen und digital dokumentieren | Heidi Systems",
		description:
			"Ein Link, ein digitaler Zwilling, zwei Fotos pro Zähler: Mit dem Heidi Installationstool ist jeder Zählertausch beim ersten Termin dokumentiert. Danach liest Heidi die Funkzähler aus der Ferne ab.",
		ogTitle:
			"Das Heidi Installationstool: Einmal in die Wohnung, dann nie wieder.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
});
