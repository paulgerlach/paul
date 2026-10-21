import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq, figures } from "$lib/landing/pages/weg-verwaltung/content";
import { ROUTE_WEG_VERWALTUNG } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heizkostenabrechnung für WEG-Verwaltungen: rechtzeitig vor der ETV | Heidi Systems",
		description:
			"Heidi liefert WEG-Verwaltungen die Heizkostenabrechnung rechtzeitig vor der Eigentümerversammlung, nachvollziehbar für jede Einheit. Der Wechsel des Messdienstes passt zur ETV, mit einer Vollmacht statt vieler Termine.",
		ogTitle: "Heizkostenabrechnung für WEG-Verwaltungen mit Heidi",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	figures: figures(Date.now()),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "weg-verwaltung",
			page: ROUTE_WEG_VERWALTUNG,
		}),
};
