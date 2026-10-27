import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/messdienstwechsel/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		title: "Messdienstleister wechseln | Heidi Systems",
		description:
			"Sie schicken uns Ihren Vertrag, Heidi erledigt den Rest. Auch mit laufendem Vertrag: Wir werten Ihre bestehenden Zähler sofort aus.",
		ogTitle: "Messdienstleister wechseln. So einfach wie nie.",
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	// The single time source of the page: the planner's today and the
	// Vollmacht's date (SSR renders them, the client clock takes over on mount).
	now: Date.now(),
});
