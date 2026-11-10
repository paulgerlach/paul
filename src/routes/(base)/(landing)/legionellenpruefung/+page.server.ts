import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { LAUNCHED } from "$lib/landing/launch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §2).
		title: "Legionellenprüfung nach Trinkwasserverordnung | Heidi",
		description:
			"Legionellenprüfung für vermietete Mehrfamilienhäuser nach § 31 TrinkwV: Heidi organisiert Probenahme, zugelassene Untersuchungsstelle und Befund. Der Check zeigt in fünf Fragen, ob Ihr Gebäude prüfpflichtig ist.",
		ogTitle: "Die Legionellenprüfung für Ihren Bestand.",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
