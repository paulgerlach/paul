import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faqItems } from "$lib/landing/pages/funktionen/content";
import { ROUTE_FUNKTIONEN } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4). Indexed from the start: the
		// page replaces a live URL (plan README, Indexing).
		title:
			"Funktionen: Funkzähler, Dashboard und Heizkostenabrechnung | Heidi Systems",
		description:
			"Fernablesbare Funkzähler, alle Verbräuche je Wohnung im Dashboard und die Heizkostenabrechnung nach HKVO. Von der Installation bis zur fertigen Abrechnung aus einer Hand.",
		ogTitle: "Daten mit höchster Effizienz bearbeiten.",
	},
	landing: DEFAULT_CHROME,
	// The first answer has an expired variant (plan 01 §1.3).
	faq: faqItems(Date.now()),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "funktionen",
			page: ROUTE_FUNKTIONEN,
		}),
};
