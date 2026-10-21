import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/private-vermieter/content";
import { ROUTE_PRIVATE_VERMIETER } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Messdienst für private Vermieter: Zähler, Ablesung und Heizkostenabrechnung ab 2 Wohnungen | Heidi Systems",
		description:
			"Heidi übernimmt für private Vermieter Funkzähler, Ablesung und die Heizkostenabrechnung nach HKVO, schon ab zwei Wohneinheiten, mit festem Ansprechpartner und ohne Ablesetermine.",
		ogTitle: "Ihre Wohnungen. Unser Messdienst. Ihre Ruhe.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "private-vermieter",
			page: ROUTE_PRIVATE_VERMIETER,
		}),
};
