export const ROUTE_AGB = "/agb";
export const ROUTE_FRAGEBOGEN = "/fragebogen";
export const ROUTE_FUNKTIONEN = "/funktionen";
export const ROUTE_IMPRESSUM = "/impressum";
// Old pages that are gone; only the redirect map ($lib/server/redirects.ts)
// uses them.
export const ROUTE_GERAETE = "/geraete";
export const ROUTE_PREISE = "/preise";
export const ROUTE_DATENSCHUTZHINWEISE = "/datenschutzhinweise";
export const ROUTE_BLOG = "/blog";
export const ROUTE_MESSDIENSTWECHSEL = "/messdienst-wechseln";
/** The Germany hub (the region template) is the home page. */
export const ROUTE_HOME = "/";
/** Prefix of the city pages. */
export const ROUTE_MESSDIENST = "/messdienst";
export const ROUTE_UPGRADE_NOW = "/fernablesung-umruesten";
export const ROUTE_UEBER_UNS = "/ueber-uns";
export const ROUTE_KARRIERE = "/karriere";
export const ROUTE_HILFE = "/hilfe";
export const ROUTE_SELBSTABRECHNUNG = "/selbstabrechnung";
export const ROUTE_VORGEHEN = "/vorgehen";
export const ROUTE_MIETERPORTAL = "/plattform/mieterportal";
export const ROUTE_DASHBOARD = "/plattform/dashboard";
export const ROUTE_AUSWERTUNG = "/plattform/auswertung";
export const ROUTE_INSTALLATIONSTOOL = "/plattform/installationstool";
export const ROUTE_SICHERHEIT = "/sicherheit";
export const ROUTE_VERBRAUCHSINFORMATION = "/plattform/verbrauchsinformation";
export const ROUTE_SCHNITTSTELLEN = "/plattform/schnittstellen";
export const ROUTE_HAUSVERWALTUNG = "/kunden/hausverwaltung";
export const ROUTE_MIETVERWALTUNG = "/kunden/mietverwaltung";
export const ROUTE_WEG_VERWALTUNG = "/kunden/weg-verwaltung";
export const ROUTE_WOHNUNGSUNTERNEHMEN = "/kunden/wohnungsunternehmen";
export const ROUTE_ASSET_MANAGER = "/kunden/asset-manager";
export const ROUTE_PRIVATE_VERMIETER = "/kunden/private-vermieter";
export const ROUTE_KUNDENREFERENZEN = "/kunden/referenzen";
export const ROUTE_NEUIGKEITEN = "/neuigkeiten";
export const ROUTE_FRISTENRECHNER = "/fristenrechner";
export const ROUTE_HKVO_LEITFADEN = "/heizkostenverordnung";
export const ROUTE_EINSPARRECHNER = "/einsparrechner";
export const ROUTE_PRESSE = "/presse";
export const ROUTE_MUSTER_KUENDIGUNG = "/messdienst-wechseln/muster-kuendigung";
export const ROUTE_ENERGIEAUSWEIS = "/energieausweis";
export const ROUTE_PORTFOLIO_CHECKER = "/portfolio-check";
export const ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN =
	"/heizkostenabrechnung-pruefen";
export const ROUTE_MESSDIENSTANBIETER_VERGLEICH = "/messdienst-vergleich";
export const ROUTE_INSTALLATIONSPARTNER = "/partner/installationspartner";
export const ROUTE_SOFTWAREPARTNER = "/partner/softwarepartner";
export const ROUTE_API_DOKUMENTATION = "/api";
export const ROUTE_VERBAENDE = "/partner/verbaende";
export const ROUTE_NACHFOLGE = "/partner/nachfolge";
export const ROUTE_PARTNERSCHAFTEN = "/partner";
export const ROUTE_KONTAKT = "/kontakt";
export const ROUTE_DEMO_BUCHEN = "/demo";
export const ROUTE_SELF_SERVICE = "/self-service";
/** A Zählercheck's result for sales: `/self-service-result/<token>`. */
export const ROUTE_SELF_SERVICE_RESULT = "/self-service-result";
/** Zähler-Interoperabilität: under the Funkzähler page (the URL list has /funkzaehler/herstellerunabhaengig). */
export const ROUTE_INTEROPERABILITAET = "/geraete/herstellerunabhaengig";
export const cityRoute = (slug: string) => `${ROUTE_MESSDIENST}/${slug}`;
