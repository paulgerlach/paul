import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_SELBSTABRECHNUNG } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heizkostenabrechnung selbst erstellen: Zählerdaten von Heidi | Heidi Systems",
		description:
			"Sie erstellen die Heizkostenabrechnung selbst, Heidi liefert die Daten: Funkzähler, Fernablesung aller Zähler und Übergabe direkt in Ihr ERP- oder CRM-System.",
		ogTitle: "Sie rechnen ab. Heidi liefert die Daten.",
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
			source: "selbstabrechnung",
			page: ROUTE_SELBSTABRECHNUNG,
		}),
};
