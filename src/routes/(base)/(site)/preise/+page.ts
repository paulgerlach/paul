import type { PageLoad } from "./$types";

export const load: PageLoad = () => ({
	seo: {
		// Its own title and description instead of the defaults (KI-37); drafts
		// for the content owner.
		title: "Preise und Pakete für Hausverwaltungen | Heidi Systems",
		description:
			"Heidi und Heidi Plus im Überblick: fernablesbare Funkzähler, kostenlose Installation und die digitale Heizkostenabrechnung für Hausverwaltungen.",
	},
});
