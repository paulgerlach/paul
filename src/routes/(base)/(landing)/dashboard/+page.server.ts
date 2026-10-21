import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_DASHBOARD } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heidi Dashboard: Verbrauch, Kosten und Abrechnung Ihres Bestands | Heidi Systems",
		description:
			"Alle Objekte in einem Dashboard: Verbräuche, Kosten und CO₂-Einsparung je Liegenschaft, Benachrichtigungen, Leckage-Wächter und Heizkostenabrechnung per Klick. Mit bedienbarer Vorschau.",
		ogTitle: "Ihr ganzer Bestand. In einem Dashboard.",
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
			source: "dashboard",
			page: ROUTE_DASHBOARD,
		}),
};
