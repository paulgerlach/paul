import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_ENERGIEAUSWEIS } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Energieausweis online beantragen: Verbrauchs- und Bedarfsausweis | Heidi Systems",
		description:
			"Verbrauchsausweis ab 69,95 €, Bedarfsausweis ab 99,95 €: rechtsgültig nach GEG, online selbst erfasst oder mit unserem Expertenteam per Video-Call oder vor Ort. Der Check zeigt in vier Fragen, welchen Ausweis Sie brauchen.",
		ogTitle: "Der Energieausweis für Ihre Liegenschaft.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "energieausweis",
			page: ROUTE_ENERGIEAUSWEIS,
		}),
};
