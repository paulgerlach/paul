import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { START_HREF } from "$lib/landing/cta";
import { readQuery } from "$lib/landing/pages/hilfe/search";
import { ROUTE_HILFE, ROUTE_MESSDIENSTWECHSEL } from "$lib/routes";
import { handleHelpFeedback } from "$lib/server/helpFeedback";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url }) => ({
	seo: {
		// Drafts for the content owner (plan §4.5).
		title: "Hilfe-Center: Antworten zu Messdienst und Heizkostenabrechnung",
		description:
			"Antworten zu Messdienstwechsel, Montage, Funkablesung, unterjähriger Verbrauchsinformation und Heizkostenabrechnung. Finden Sie Ihre Frage oder sprechen Sie mit Ihrem Ansprechpartner.",
		ogTitle: "Wie können wir helfen?",
		// Until its go-live gate is done (plan §4.5). Then also add it to the
		// sitemap. A search URL (?q=) stays noindex after that; its canonical
		// is /hilfe, since Seo builds it from the path.
		noindex: true,
		keepCanonical: true,
	},
	// No signup form here: the nav's "Demo buchen" goes to /messdienstwechsel's.
	landing: {
		...DEFAULT_CHROME,
		demoHref: `${ROUTE_MESSDIENSTWECHSEL}${START_HREF}`,
	},
	// The deadline answer's variant (plan 01 §1.3).
	now: Date.now(),
	// The search without JS: the form submits ?q=, the server renders the results.
	q: readQuery(url),
});

export const actions: Actions = {
	feedback: (event) => handleHelpFeedback(event, { page: ROUTE_HILFE }),
};
