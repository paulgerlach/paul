import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/installationspartner/content";
import {
	ROUTE_INSTALLATIONSPARTNER,
	ROUTE_MESSDIENSTWECHSEL,
} from "$lib/routes";
import {
	emptyPartnerForm,
	handlePartnerInquiry,
} from "$lib/server/partnerInquiry";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Installationspartner werden: Zähler montieren mit Heidi | Heidi Systems",
		description:
			"Werden Sie zertifizierter Installationspartner von Heidi Systems: Wir schulen Ihr Team auf Funkzähler und das Installationstool, informieren die Mieter und planen die Einsätze in Ihrer Region. Deutschlandweit, ohne Klemmbrett.",
		ogTitle: "Installationspartner von Heidi Systems",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	// No signup form here: the nav CTA goes to /messdienstwechsel's (open question 1).
	landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
	faq: faq.items,
	partnerForm: await emptyPartnerForm(),
});

export const actions: Actions = {
	default: (event) =>
		handlePartnerInquiry(event, { page: ROUTE_INSTALLATIONSPARTNER }),
};
