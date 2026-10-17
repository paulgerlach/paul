import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_MIETERPORTAL } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Mieterportal: monatliche Verbrauchsinformation für Ihre Mieter | Heidi Systems",
		description:
			"Im Heidi Mieterportal sehen Ihre Mieter ihren Verbrauch jeden Monat, mit Vergleich zu Vormonat, Vorjahr und Durchschnitt. Nach § 6a HeizkostenV, ohne Aufwand für Ihr Team.",
		ogTitle: "Das Heidi Mieterportal für Ihre Mieter",
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
			source: "mieterportal",
			page: ROUTE_MIETERPORTAL,
		}),
};
