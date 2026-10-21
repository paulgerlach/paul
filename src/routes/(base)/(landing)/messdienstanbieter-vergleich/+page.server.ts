import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_MESSDIENSTANBIETER_VERGLEICH } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Messdienstanbieter-Vergleich: Ihren Messdienst in 8 Kriterien prüfen | Heidi Systems",
		description:
			"Stellen Sie Ihren Messdienst in acht Kriterien neben Heidi und rechnen Sie aus, was Sie pro Wohnung und Jahr zahlen: Gerätemiete, Ablesung und Abrechnung. Ohne Anmeldung, Ihre Angaben bleiben im Browser.",
		ogTitle: "Wie gut ist Ihr Messdienst wirklich?",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "messdienstanbieter-vergleich",
			page: ROUTE_MESSDIENSTANBIETER_VERGLEICH,
		}),
};
