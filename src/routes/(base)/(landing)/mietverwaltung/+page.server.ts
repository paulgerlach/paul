import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq, figures } from "$lib/landing/pages/mietverwaltung/content";
import { ROUTE_MIETVERWALTUNG } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Messdienst für Mietverwaltungen: Heizkostenabrechnung pünktlich zur BKA | Heidi Systems",
		description:
			"Heidi liefert Mietverwaltungen die Heizkostenabrechnung rechtzeitig zur Betriebskostenabrechnung, für jedes Objekt und jeden Eigentümer. Mit Funkzählern, Zwischenablesung per Funk beim Mieterwechsel und Verbrauchsinfo für Ihre Mieter.",
		ogTitle: "Messdienst für Mietverwaltungen mit Heidi",
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
			source: "mietverwaltung",
			page: ROUTE_MIETVERWALTUNG,
		}),
};
