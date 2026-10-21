import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_EINSPARRECHNER } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Einsparrechner: Was der Messdienstwechsel Ihrem Bestand bringt | Heidi Systems",
		description:
			"Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team bei Ablesung, Mieterfragen und Heizkostenabrechnung abnimmt und welches Kürzungsrisiko nach § 12 HeizkostenV Sie vermeiden.",
		ogTitle: "Was der Wechsel Ihrem Bestand bringt.",
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
			source: "einsparrechner",
			page: ROUTE_EINSPARRECHNER,
		}),
};
