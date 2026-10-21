export const ROUTE_AGB = "/agb";
export const ROUTE_DATENSCHUTZHINWEISE = "/datenschutzhinweise";
export const ROUTE_FRAGEBOGEN = "/fragebogen";
export const ROUTE_FUNKTIONEN = "/funktionen";
export const ROUTE_IMPRESSUM = "/impressum";
// Old pages that are gone; only the redirect map ($lib/server/redirects.ts)
// uses them.
export const ROUTE_KONTAKT = "/kontakt";
export const ROUTE_GERAETE = "/geraete";
export const ROUTE_PREISE = "/preise";
export const ROUTE_BLOG = "/blog";
export const ROUTE_MESSDIENSTWECHSEL = "/messdienstwechsel";
export const ROUTE_MESSDIENSTANBIETER = "/messdienstanbieter";
export const ROUTE_UPGRADE_NOW = "/upgrade-now";
export const ROUTE_UEBER_UNS = "/ueber-uns";
export const ROUTE_KARRIERE = "/karriere";
export const ROUTE_HILFE = "/hilfe";
export const ROUTE_SELBSTABRECHNUNG = "/selbstabrechnung";
export const ROUTE_VORGEHEN = "/vorgehen";
export const ROUTE_MIETERPORTAL = "/mieterportal";
export const ROUTE_DASHBOARD = "/dashboard";
export const ROUTE_AUSWERTUNG = "/auswertung";
export const ROUTE_INSTALLATIONSTOOL = "/installationstool";
export const ROUTE_SICHERHEIT = "/sicherheit";
export const ROUTE_VERBRAUCHSINFORMATION = "/verbrauchsinformation";
export const ROUTE_SCHNITTSTELLEN = "/schnittstellen";
export const ROUTE_HAUSVERWALTUNG = "/hausverwaltung";
export const ROUTE_MIETVERWALTUNG = "/mietverwaltung";
export const ROUTE_WEG_VERWALTUNG = "/weg-verwaltung";
export const ROUTE_WOHNUNGSUNTERNEHMEN = "/wohnungsunternehmen";
export const ROUTE_ASSET_MANAGER = "/asset-manager";
export const ROUTE_PRIVATE_VERMIETER = "/private-vermieter";
export const ROUTE_NEUIGKEITEN = "/neuigkeiten";
export const ROUTE_FRISTENRECHNER = "/fristenrechner";
export const ROUTE_HKVO_LEITFADEN = "/hkvo-leitfaden";
export const ROUTE_EINSPARRECHNER = "/einsparrechner";
export const ROUTE_PRESSE = "/presse";
export const ROUTE_MUSTER_KUENDIGUNG = "/muster-kuendigung";
export const ROUTE_ENERGIEAUSWEIS = "/energieausweis";
export const ROUTE_PORTFOLIO_CHECKER = "/portfolio-checker";
export const ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN =
	"/heizkostenabrechnung-pruefen";
export const ROUTE_MESSDIENSTANBIETER_VERGLEICH =
	"/messdienstanbieter-vergleich";
export const ROUTE_INSTALLATIONSPARTNER = "/installationspartner";
export const ROUTE_SOFTWAREPARTNER = "/softwarepartner";
export const ROUTE_API_DOKUMENTATION = "/api-dokumentation";
export const ROUTE_VERBAENDE = "/verbaende";
export const ROUTE_NACHFOLGE = "/nachfolge";
export const ROUTE_PARTNERSCHAFTEN = "/partnerschaften";
export const cityRoute = (slug: string) =>
	`${ROUTE_MESSDIENSTANBIETER}/${slug}`;
