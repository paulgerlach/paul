import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { readQuery } from "$lib/landing/pages/hilfe/search";
import { ROUTE_HILFE } from "$lib/routes";
import { handleHelpFeedback } from "$lib/server/helpFeedback";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url }) => ({
	seo: {
		// Drafts for the content owner (plan §4.5).
		title: "Hilfe-Center: Antworten zu Messdienst und Heizkostenabrechnung",
		description:
			"Antworten zu Messdienstwechsel, Montage, Funkablesung, unterjähriger Verbrauchsinformation und Heizkostenabrechnung. Finden Sie Ihre Frage oder sprechen Sie mit Ihrem Ansprechpartner.",
		ogTitle: "Wie können wir helfen?",
		// Until its go-live gate is done (plan §4.5). A search URL (?q=) stays
		// noindex after that; its canonical is /hilfe, since Seo builds it from
		// the path.
		noindex: !LAUNCHED || url.searchParams.has("q"),
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The deadline answer's variant (plan 01 §1.3).
	now: Date.now(),
	// The search without JS: the form submits ?q=, the server renders the results.
	q: readQuery(url),
});

export const actions: Actions = {
	feedback: (event) => handleHelpFeedback(event, { page: ROUTE_HILFE }),
};
