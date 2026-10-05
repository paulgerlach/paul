export const ROUTE_HOME = "/";
export const ROUTE_KONTAKT = "/kontakt";
export const ROUTE_DATENSCHUTZHINWEISE = "/datenschutzhinweise";
export const ROUTE_FRAGEBOGEN = "/fragebogen";
export const ROUTE_FUNKTIONEN = "/funktionen";
export const ROUTE_GERAETE = "/geraete";
export const ROUTE_IMPRESSUM = "/impressum";
export const ROUTE_PREISE = "/preise";
export const ROUTE_BLOG = "/blog";
export const ROUTE_MESSDIENSTWECHSEL = "/messdienstwechsel";
export const ROUTE_MESSDIENSTANBIETER = "/messdienstanbieter";
export const cityRoute = (slug: string) =>
	`${ROUTE_MESSDIENSTANBIETER}/${slug}`;
