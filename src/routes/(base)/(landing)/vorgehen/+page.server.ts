import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_VORGEHEN } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"So geht Heidi vor: in drei Schritten zum digitalen Messdienst | Heidi Systems",
		description:
			"Bedarfsanalyse, Installation der Funktechnik, Verbrauchsanalyse und Abrechnung: So rüstet Heidi Ihren Bestand auf fernablesbare Zähler um. Alles aus einer Hand.",
		ogTitle: "So geht Heidi vor. In drei Schritten digital.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The day count to 1.1.2027 (plan 01 §1.4).
	now: Date.now(),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "vorgehen", page: ROUTE_VORGEHEN }),
};
