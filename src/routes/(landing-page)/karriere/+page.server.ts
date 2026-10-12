import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_KARRIERE, ROUTE_MESSDIENSTWECHSEL } from "$lib/routes";
import {
	emptyApplicationForm,
	handleApplication,
} from "$lib/server/application";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Karriere: Jobs bei Heidi Systems in Berlin",
		description:
			"Bauen Sie mit uns den Messdienst von morgen: Funkzähler, Software und Service aus Berlin. Offene Stellen in Engineering, Operations, Kundenservice und Vertrieb, Initiativbewerbungen willkommen.",
		ogTitle: "Bauen Sie mit uns den Messdienst von morgen.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	// No signup form here: the nav CTA goes to /messdienstwechsel's (open question 6).
	landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
	applicationForm: await emptyApplicationForm(),
});

export const actions: Actions = {
	default: (event) => handleApplication(event, { page: ROUTE_KARRIERE }),
};
