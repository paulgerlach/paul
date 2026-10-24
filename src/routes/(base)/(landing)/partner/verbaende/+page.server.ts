import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/verbaende/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heidi Systems in den Verbänden: VDIV, DEUMESS und bved | Heidi Systems",
		description:
			"Heidi Systems ist Kooperationspartner des VDIV und in den Verbänden DEUMESS und bved vernetzt. Für korrekte Daten, faire Abrechnungen und verlässliche Partner im Messdienst.",
		ogTitle: "Heidi Systems in den Verbänden der Branche",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
});
