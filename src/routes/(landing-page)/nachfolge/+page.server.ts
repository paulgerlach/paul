import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq, figures } from "$lib/landing/pages/nachfolge/content";
import { ROUTE_MESSDIENSTWECHSEL, ROUTE_NACHFOLGE } from "$lib/routes";
import {
	emptySuccessionForm,
	handleSuccessionInquiry,
} from "$lib/server/successionInquiry";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Nachfolge für Messdienstanbieter: Ihr Messdienst in guten Händen | Heidi Systems",
		description:
			"Sie führen einen Messdienst und suchen eine Nachfolge? Heidi Systems führt Kunden, Geräte und Verträge verlässlich weiter. Vertraulich, persönlich und mit Respekt vor dem, was Sie aufgebaut haben.",
		ogTitle: "Nachfolge für Messdienstanbieter mit Heidi",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	// No signup form here: the nav CTA goes to /messdienstwechsel's.
	landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
	faq: faq.items,
	// The deadline's figure for today (plan 01 §1.2).
	figures: figures(Date.now()),
	successionForm: await emptySuccessionForm(),
});

export const actions: Actions = {
	default: (event) => handleSuccessionInquiry(event, { page: ROUTE_NACHFOLGE }),
};
