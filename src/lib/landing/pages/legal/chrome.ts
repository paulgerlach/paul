import { DEFAULT_CHROME, type LandingChrome } from "$lib/landing/chrome";
import { START_HREF } from "$lib/landing/cta";
import { ROUTE_MESSDIENSTWECHSEL } from "$lib/routes";

/** The legal pages have no signup form: "Demo buchen" goes to /messdienstwechsel's. */
export const LEGAL_DEMO_HREF = `${ROUTE_MESSDIENSTWECHSEL}${START_HREF}`;

export const LEGAL_CHROME: LandingChrome = {
	...DEFAULT_CHROME,
	demoHref: LEGAL_DEMO_HREF,
};
