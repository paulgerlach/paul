import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_UEBER_UNS } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Über uns: Messdienst aus Berlin | Heidi Systems",
		description:
			"Heidi Systems übernimmt für Hausverwaltungen den kompletten Messdienst: eigene Funkzähler, kostenlose Installation, Ablesung per Funk und die Heizkostenabrechnung auf Knopfdruck.",
		ogTitle: "Messdienst, wie er heute sein sollte.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The mission card's day count renders from this; the client clock takes
	// over on mount.
	now: Date.now(),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "ueber-uns", page: ROUTE_UEBER_UNS }),
};
