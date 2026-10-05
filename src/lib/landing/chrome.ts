/**
 * Texts of the landing header that differ per page. A landing page returns
 * them from its `load` as `landing`; the layout passes them to the header.
 */
export type LandingChrome = {
	bannerText: string;
	/** Label of the nav CTA to `#start`. */
	ctaLabel?: string;
};

/** /messdienstwechsel's texts, also the fallback (e.g. on an error page). */
export const DEFAULT_CHROME: LandingChrome = {
	bannerText:
		"Ab 1.1.2027 müssen Zähler und Heizkostenverteiler fernablesbar sein. Jetzt den Wechsel prüfen.",
};
