import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/funkzaehler/content";
import { ROUTE_FUNKZAEHLER } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (go-live gate §2).
		title:
			"Funkzähler: Heizkostenverteiler, Wasserzähler und Rauchwarnmelder | Heidi Systems",
		description:
			"Heizkostenverteiler, Wärme- und Wasserzähler, Rauchwarnmelder und Funk-Gateway von Heidi: fernablesbar, wie ab 1.1.2027 vorgeschrieben, ohne Ablesetermin in der Wohnung.",
		ogTitle: "Funkzähler von Heidi: fernablesbar, ohne Termin in der Wohnung",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "funkzaehler",
			page: ROUTE_FUNKZAEHLER,
		}),
};
