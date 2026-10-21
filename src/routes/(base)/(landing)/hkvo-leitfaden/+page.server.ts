import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_HKVO_LEITFADEN } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"HKVO-Leitfaden: Die Heizkostenverordnung einfach erklärt | Heidi Systems",
		description:
			"Pflichten nach der Heizkostenverordnung im Überblick: Verbrauchserfassung, Fernablesbarkeit, monatliche Verbrauchsinformation, Kostenverteilung, CO₂-Kosten und Kürzungsrechte der Mieter. Mit Paragrafen und Schnell-Check.",
		ogTitle: "Die Heizkostenverordnung. Einfach erklärt.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "hkvo-leitfaden",
			page: ROUTE_HKVO_LEITFADEN,
		}),
};
