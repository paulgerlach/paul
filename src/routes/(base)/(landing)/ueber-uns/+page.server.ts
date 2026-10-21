import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.7).
		title: "Über uns: Messdienst aus Berlin | Heidi Systems",
		description:
			"Heidi Systems übernimmt für Hausverwaltungen den kompletten Messdienst: eigene Funkzähler, kostenlose Installation, Ablesung per Funk und die Heizkostenabrechnung auf Knopfdruck.",
		ogTitle: "Messdienst, wie er heute sein sollte.",
		// Until its go-live gate is done (plan §4.7). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The mission card's day count renders from this; the client clock takes
	// over on mount.
	now: Date.now(),
});
