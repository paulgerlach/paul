export const SITE_URL = "https://heidisystems.com";

/** Values from the Next root layout (`app/layout.tsx`). */
export const ROOT_TITLE =
	"Heidi Systems | Fernablesbare Funkzähler für Warmwasser, Kaltwasser & Heizung";
export const ROOT_DESCRIPTION =
	"Digitale Erfassung aller Verbrauchsdaten im Gebäude. Kostenlose Installation fernablesbarer Funkzähler für Warmwasser, Kaltwasser und Heizung. Automatisierte Betriebskostenabrechnung in Deutschland.";

/** Values the `(base)` and `(service)` layouts override the root ones with. */
export const DEFAULT_TITLE = "Heidi Systems";
export const DEFAULT_DESCRIPTION =
	"Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.";

export const DEFAULT_OG_TITLE =
	"Heidi Systems | Fernablesbare Funkzähler für Deutschland";
export const DEFAULT_OG_DESCRIPTION =
	"Kostenlose Installation fernablesbarer Funkzähler für Warmwasser, Kaltwasser und Heizung. Automatisierte Betriebskostenabrechnung in Deutschland.";

export const KEYWORDS = [
	"Fernablesbare Zähler",
	"Funkzähler",
	"Warmwasserzähler",
	"Kaltwasserzähler",
	"Heizkostenabrechnung",
	"Betriebskostenabrechnung",
	"Energiemanagement",
	"Verbrauchserfassung",
	"Digitale Zähler",
	"Deutschland",
	"Kostenlose Installation",
];

/** Set by a page's `load` as `seo` to override the defaults. */
export type SeoData = {
	title?: string;
	description?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	noindex?: boolean;
	/** Keep the self-referencing canonical on a noindex page (a city page before its go-live). */
	keepCanonical?: boolean;
};
