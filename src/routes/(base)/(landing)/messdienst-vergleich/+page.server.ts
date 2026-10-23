import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Messdienstanbieter-Vergleich: Ihren Messdienst in 8 Kriterien prüfen | Heidi Systems",
		description:
			"Stellen Sie Ihren Messdienst in acht Kriterien neben Heidi und rechnen Sie aus, was Sie pro Wohnung und Jahr zahlen: Gerätemiete, Ablesung und Abrechnung. Ohne Anmeldung, Ihre Angaben bleiben im Browser.",
		ogTitle: "Wie gut ist Ihr Messdienst wirklich?",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
