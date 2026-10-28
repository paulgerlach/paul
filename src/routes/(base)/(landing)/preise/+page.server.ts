import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §2). Indexed from the
		// start: the page replaces the live /preise.
		title: "Preise: Gerätemiete und Heizkostenabrechnung | Heidi Systems",
		description:
			"Sie zahlen pro verbautem Gerät und pro Wohnung für die Heizkostenabrechnung. Gerätemiete, Wartung und Abrechnung legen Sie als Betriebskosten auf die Mieter um.",
		ogTitle:
			"Sie zahlen pro verbautem Gerät. Und reichen es an die Mieter weiter.",
	},
	landing: DEFAULT_CHROME,
});
