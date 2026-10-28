import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_KARRIERE } from "$lib/routes";
import {
	emptyApplicationForm,
	handleApplication,
} from "$lib/server/application";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.6).
		title: "Karriere: Jobs bei Heidi Systems in Berlin",
		description:
			"Bauen Sie mit uns den Messdienst von morgen: Funkzähler, Software und Service aus Berlin. Offene Stellen in Engineering, Operations, Kundenservice und Vertrieb, Initiativbewerbungen willkommen.",
		ogTitle: "Bauen Sie mit uns den Messdienst von morgen.",
		// Until its go-live gate is done (plan §4.6). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	applicationForm: await emptyApplicationForm(),
});

export const actions: Actions = {
	default: (event) => handleApplication(event, { page: ROUTE_KARRIERE }),
};
