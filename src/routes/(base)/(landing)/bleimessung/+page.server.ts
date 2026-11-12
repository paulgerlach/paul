import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { LAUNCHED } from "$lib/landing/launch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §2).
		title: "Bleimessung im Trinkwasser nach TrinkwV | Heidi",
		description:
			"Bleimessung im Trinkwasser: Grenzwerte, Pflichten zu Bleileitungen nach Trinkwasserverordnung und Ablauf. Heidi organisiert die Messung für Ihre Liegenschaften, durch eine zugelassene Untersuchungsstelle.",
		ogTitle: "Blei im Trinkwasser? Messen statt vermuten.",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The single time source of the page: SSR renders the days since the
	// § 17 TrinkwV deadline from it, the client clock takes over on mount.
	now: Date.now(),
});
