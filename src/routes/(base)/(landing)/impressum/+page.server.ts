import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (ongoing-tasks/go-live-gates.md §1).
		// Indexed: the page replaces a live URL.
		title: "Impressum | Heidi Systems",
		description:
			"Impressum der Heidi Systems GmbH, Monbijouplatz 4, 10178 Berlin: Anbieter, Vertretung, Kontakt, Registereintrag und Umsatzsteuer-ID nach § 5 DDG.",
	},
	landing: DEFAULT_CHROME,
});
