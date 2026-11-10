import { SITE_PAGES } from "../../src/lib/sitePages";

// Every page of the site (the gated ones too), plus one city, one blog post
// and the questionnaire, plus the booking page behind /demo's questionnaire.
export const PAGES = [
	...SITE_PAGES.map((p) => p.path),
	"/messdienst/berlin",
	"/blog/wasserzaehler-mit-fernablesung",
	"/fragebogen",
	"/demo/termin",
];
