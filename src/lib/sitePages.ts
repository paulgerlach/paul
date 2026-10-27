import * as r from "$lib/routes";

export type SitePage = {
	path: string;
	changefreq: "weekly" | "monthly" | "yearly";
	priority: number;
	/**
	 * Behind a go-live gate (ongoing-tasks/go-live-gates.md): noindex and out
	 * of the sitemap until `LAUNCHED` ($lib/landing/launch.ts).
	 */
	gated: boolean;
};

const page = (
	path: string,
	priority: number,
	gated = true,
	changefreq: SitePage["changefreq"] = "monthly",
): SitePage => ({ path, changefreq, priority, gated });

/**
 * Every page of the site, for the sitemap: each route under
 * src/routes/(base) once (sitePages.test.ts checks), except the city pages
 * (`LIVE_CITIES`), the blog posts (from Prismic) and /fragebogen (disallowed
 * in robots.txt).
 */
export const SITE_PAGES: SitePage[] = [
	page(r.ROUTE_HOME, 1, false, "weekly"),
	page(r.ROUTE_MESSDIENSTWECHSEL, 0.9, false),
	page(r.ROUTE_FUNKTIONEN, 0.9, false),
	page(r.ROUTE_PREISE, 0.8, false),
	// Product and segment pages
	page(r.ROUTE_VORGEHEN, 0.8),
	page(r.ROUTE_UPGRADE_NOW, 0.8),
	page(r.ROUTE_SELBSTABRECHNUNG, 0.8),
	page(r.ROUTE_VERBRAUCHSINFORMATION, 0.8),
	page(r.ROUTE_MIETERPORTAL, 0.8),
	page(r.ROUTE_DASHBOARD, 0.8),
	page(r.ROUTE_AUSWERTUNG, 0.8),
	page(r.ROUTE_SCHNITTSTELLEN, 0.8),
	page(r.ROUTE_INSTALLATIONSTOOL, 0.8),
	page(r.ROUTE_GERAETE, 0.8),
	page(r.ROUTE_INTEROPERABILITAET, 0.8),
	page(r.ROUTE_HAUSVERWALTUNG, 0.8),
	page(r.ROUTE_MIETVERWALTUNG, 0.8),
	page(r.ROUTE_WEG_VERWALTUNG, 0.8),
	page(r.ROUTE_WOHNUNGSUNTERNEHMEN, 0.8),
	page(r.ROUTE_PRIVATE_VERMIETER, 0.8),
	page(r.ROUTE_ASSET_MANAGER, 0.8),
	page(r.ROUTE_KUNDENREFERENZEN, 0.8),
	// Resources
	page(r.ROUTE_BLOG, 0.7, false, "weekly"),
	page(r.ROUTE_NEUIGKEITEN, 0.7),
	page(r.ROUTE_FRISTENRECHNER, 0.7),
	page(r.ROUTE_HKVO_LEITFADEN, 0.7),
	page(r.ROUTE_EINSPARRECHNER, 0.7),
	page(r.ROUTE_PRESSE, 0.7),
	page(r.ROUTE_MUSTER_KUENDIGUNG, 0.7),
	page(r.ROUTE_ENERGIEAUSWEIS, 0.7),
	page(r.ROUTE_PORTFOLIO_CHECKER, 0.7),
	page(r.ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN, 0.7),
	page(r.ROUTE_MESSDIENSTANBIETER_VERGLEICH, 0.7),
	page(r.ROUTE_HILFE, 0.7),
	page(r.ROUTE_API_DOKUMENTATION, 0.7),
	// Company and partner pages
	page(r.ROUTE_UEBER_UNS, 0.6),
	page(r.ROUTE_KARRIERE, 0.6),
	page(r.ROUTE_SICHERHEIT, 0.6),
	page(r.ROUTE_INSTALLATIONSPARTNER, 0.6),
	page(r.ROUTE_SOFTWAREPARTNER, 0.6),
	page(r.ROUTE_VERBAENDE, 0.6),
	page(r.ROUTE_NACHFOLGE, 0.6),
	page(r.ROUTE_PARTNERSCHAFTEN, 0.6),
	page(r.ROUTE_KONTAKT, 0.6),
	page(r.ROUTE_DEMO_BUCHEN, 0.7),
	page(r.ROUTE_SELF_SERVICE, 0.7),
	// Legal
	page(r.ROUTE_IMPRESSUM, 0.3, false, "yearly"),
	page(r.ROUTE_DATENSCHUTZHINWEISE, 0.3, false, "yearly"),
	page(r.ROUTE_AGB, 0.3, true, "yearly"),
];
