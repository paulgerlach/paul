/**
 * The city search of /kunden/referenzen (the design's `#rf-js`): a name
 * matches when it contains the query, ignoring case and spelling umlauts
 * out ("muenchen" finds München). An empty query matches every name.
 */
export const normalize = (s: string) =>
	s
		.toLowerCase()
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss");

export function matchesCity(name: string, query: string) {
	const q = normalize(query.trim());
	return !q || normalize(name).includes(q);
}
