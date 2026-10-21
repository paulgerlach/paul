import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Fristenrechner Messdienst: Kündigung, Eichfrist und Abrechnung | Heidi Systems",
		description:
			"Kostenlos und ohne Anmeldung: Berechnen Sie, bis wann Sie Ihren Messdienstvertrag kündigen müssen, wann die Eichfrist Ihrer Zähler abläuft und bis wann die Abrechnung beim Mieter sein muss.",
		ogTitle: "Jede Frist im Messdienst. Auf den Tag genau.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The single time source of the page: SSR renders every date from it
	// (the calculator's defaults and results, the milestones' badges), the
	// client clock takes over on mount.
	now: Date.now(),
});
