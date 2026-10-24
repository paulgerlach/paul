import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Einsparrechner: Was der Messdienstwechsel Ihrem Bestand bringt | Heidi Systems",
		description:
			"Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team bei Ablesung, Mieterfragen und Heizkostenabrechnung abnimmt und welches Kürzungsrisiko nach § 12 HeizkostenV Sie vermeiden.",
		ogTitle: "Was der Wechsel Ihrem Bestand bringt.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
