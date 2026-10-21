import { ROUTE_UPGRADE_NOW } from "$lib/routes";

/**
 * Texts and targets of the landing header that differ per page. A landing
 * page returns them from its `load` as `landing`; the layout passes them to
 * the header.
 */
export type LandingChrome = {
	bannerText: string;
	/** Target of the banner's "Mehr erfahren" link (default `#faq`). */
	bannerHref?: string;
	/**
	 * Target of the nav's "Demo buchen" (default `DEMO_HREF`, the page's
	 * signup form). A page without a signup form sends it elsewhere.
	 */
	demoHref?: string;
};

/** /messdienstwechsel's texts, also the fallback (e.g. on an error page). */
export const DEFAULT_CHROME: LandingChrome = {
	bannerText:
		"Ab 1.1.2027 müssen Zähler und Heizkostenverteiler fernablesbar sein. Jetzt den Wechsel prüfen.",
	bannerHref: ROUTE_UPGRADE_NOW,
};
