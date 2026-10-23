import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_AUSWERTUNG } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heidi Auswertung: Verbräuche Ihres Bestands klar ausgewertet | Heidi Systems",
		description:
			"Heidi wertet die Funkdaten aller Zähler für jede Liegenschaft aus: geprüfte Werte, Vergleich im Portfolio, Jahresverlauf zum Vorjahr, Hinweise mit nächsten Schritten und Berichte für Eigentümer.",
		ogTitle: "Ihre Verbräuche. Klar ausgewertet.",
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
			source: "auswertung",
			page: ROUTE_AUSWERTUNG,
		}),
};
