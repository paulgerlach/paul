/**
 * The meters Heidi installs (the design's Engelmann catalog, `CAT2`) and the
 * size selects built from it (`casHTML`, `cOpts`, `casFix`): each select of a
 * group offers only the values that fit the ones chosen before it, in the
 * order `FIELDS`; with one fitting value left, the later fields are filled
 * in. A value outside the catalog ("Anderer Wert" with a free input) is a
 * special size (`specialSizes`). Pure.
 */
import type { Option } from "./data";
import type { Group } from "./model";

/** The catalog's fields. */
export type CatKey = "q3" | "bl" | "gew" | "qp" | "dn" | "fg" | "wks";
type CatRow = Partial<Record<CatKey, string>>;
/** A catalog: the water meters, the heat meters on or under plaster. */
export type CatId = "kwz" | "wwz" | "wmzap" | "wmzup";

const CATALOG: Record<CatId, CatRow[]> = {
	kwz: [
		{ q3: "2,5", bl: "80", gew: "G ¾", dn: "15" },
		{ q3: "2,5", bl: "110", gew: "G ¾", dn: "15" },
	],
	wwz: [
		{ q3: "2,5", bl: "80", gew: "G ¾", dn: "15" },
		{ q3: "2,5", bl: "110", gew: "G ¾", dn: "15" },
	],
	wmzap: [
		{ qp: "0,6", dn: "15", bl: "110", fg: "5.0", gew: "G ¾" },
		{ qp: "1,5", dn: "20", bl: "105", fg: "5.0", gew: "G 1" },
		{ qp: "1,5", dn: "15", bl: "110", fg: "5.0", gew: "G ¾" },
		{ qp: "1,5", dn: "20", bl: "130", fg: "5.0", gew: "G 1" },
		{ qp: "2,5", dn: "20", bl: "105", fg: "5.0", gew: "G 1" },
		{ qp: "2,5", dn: "20", bl: "130", fg: "5.0", gew: "G 1" },
		{ qp: "0,6", dn: "15", bl: "110", fg: "5.2", gew: "G ¾" },
		{ qp: "1,5", dn: "20", bl: "105", fg: "5.2", gew: "G 1" },
		{ qp: "1,5", dn: "15", bl: "110", fg: "5.2", gew: "G ¾" },
		{ qp: "1,5", dn: "20", bl: "130", fg: "5.2", gew: "G 1" },
		{ qp: "2,5", dn: "20", bl: "105", fg: "5.2", gew: "G 1" },
		{ qp: "2,5", dn: "20", bl: "130", fg: "5.2", gew: "G 1" },
	],
	wmzup: [
		{ wks: "EAS2", qp: "0,6", fg: "5.0" },
		{ wks: "EAS2", qp: "1,5", fg: "5.0" },
		{ wks: "EAS2", qp: "2,5", fg: "5.0" },
		{ wks: "EAS2", qp: "0,6", fg: "5.2" },
		{ wks: "EAS2", qp: "1,5", fg: "5.2" },
		{ wks: "EAS2", qp: "2,5", fg: "5.2" },
		{ wks: "M77", qp: "0,6", fg: "6.0" },
		{ wks: "M77", qp: "1,5", fg: "6.0" },
		{ wks: "M77", qp: "2,5", fg: "6.0" },
		{ wks: "M62", qp: "0,6", fg: "5.2" },
		{ wks: "M62", qp: "1,5", fg: "5.2" },
		{ wks: "M62", qp: "2,5", fg: "5.2" },
		{ wks: "M60", qp: "0,6", fg: "5.0" },
		{ wks: "M60", qp: "1,5", fg: "5.0" },
		{ wks: "M60", qp: "2,5", fg: "5.0" },
		{ wks: "DM1", qp: "1,5", fg: "5.2" },
	],
};

/** Each catalog's selects, in the order they narrow each other (`CORD`). */
export const FIELDS: Record<CatId, CatKey[]> = {
	kwz: ["q3", "bl", "gew"],
	wwz: ["q3", "bl", "gew"],
	wmzap: ["qp", "dn", "bl", "fg"],
	wmzup: ["wks", "qp", "fg"],
};

/** The selects' labels (`CLAB`). */
export const FIELD_LABELS: Record<CatKey, string> = {
	q3: "Dauerdurchfluss Q3/Qn",
	bl: "Einbaulänge",
	gew: "Anschlussgewinde",
	qp: "Nenndurchfluss qp",
	dn: "Nennweite DN",
	fg: "Temperaturfühlergröße",
	wks: "Kapselsystem",
};

/** The capsule systems (`WKSL`). */
const CAPSULE_SYSTEMS: Record<string, string> = {
	EAS2: "Ista 2″ (EAS)",
	M77: "Allmess M77×1,5",
	M62: "Techem M62×2",
	M60: "Minol M60×1,5",
	DM1: "Deltamess TKS (DM1)",
};

/** The free input's placeholder for "Anderer Wert". */
export const FREE_PLACEHOLDERS: Record<CatKey, string> = {
	bl: "Einbaulänge in mm",
	dn: "z. B. DN 25",
	gew: "z. B. G 1¼",
	qp: "qp in m³/h",
	q3: "Q3 in m³/h",
	fg: "z. B. 5,0 mm",
	wks: "Hersteller oder Gewinde",
};

/** A catalog value as shown (`cVal`). */
export function catLabel(k: CatKey, v: string): string {
	if (k === "bl") return `${v} mm`;
	if (k === "dn") return `DN ${v}`;
	if (k === "qp") return `${v} m³/h`;
	if (k === "q3") return `Q3 ${v} m³/h`;
	if (k === "fg") return `${v.replace(".", ",")} mm`;
	if (k === "wks") return CAPSULE_SYSTEMS[v] ?? v;
	return v;
}

/** The group's catalog, none before the heat meter's type is chosen (`cKey`). */
export function catalogOf(d: string, g: Group): CatId | null {
	if (d === "kwz" || d === "wwz") return d;
	if (d === "wmz")
		return g.wtyp === "up" ? "wmzup" : g.wtyp === "ap" ? "wmzap" : null;
	return null;
}

/** A value from the list, not "andere" or "unbekannt" (`cStd`). */
const standard = (v: string | undefined): v is string =>
	Boolean(v) && v !== "andere" && v !== "unbekannt";

const numeric = (v: string) => parseFloat(v.replace(",", "."));

/** The values of `k` that fit the fields before it, sorted (`cOpts`). */
export function fieldValues(id: CatId, g: Group, k: CatKey): string[] {
	const order = FIELDS[id];
	let rows = CATALOG[id];
	for (const f of order.slice(0, order.indexOf(k))) {
		const v = g[f];
		if (!standard(v)) continue;
		const fit = rows.filter((r) => r[f] === v);
		if (fit.length) rows = fit;
	}
	const seen = new Set<string>();
	for (const r of rows) if (r[k]) seen.add(r[k]);
	return [...seen].sort((a, b) => {
		const x = numeric(a);
		const y = numeric(b);
		return Number.isNaN(x) || Number.isNaN(y) ? a.localeCompare(b) : x - y;
	});
}

/** Every value of `k` in the catalog (`cAll`). */
const allValues = (id: CatId, k: CatKey) =>
	new Set(CATALOG[id].flatMap((r) => (r[k] ? [r[k]] : [])));

/**
 * Moves values outside the catalog to the free input (older answers, as
 * `selC` does before drawing the selects). Changes `g`.
 */
export function moveOutsideValues(id: CatId, g: Group) {
	for (const k of FIELDS[id]) {
		const v = g[k];
		if (standard(v) && !allValues(id, k).has(v)) {
			g[`${k}x`] = v;
			g[k] = "andere";
		}
	}
}

/**
 * A select's options (`selC`): the fitting values, the current one if it
 * no longer fits, "Anderer Wert" and, where offered, "Unbekannt" ("Weiß ich
 * nicht" for the sensor).
 */
export function fieldOptions(
	d: string,
	id: CatId,
	g: Group,
	k: CatKey,
): Option[] {
	const values = fieldValues(id, g, k);
	const list: Option[] = values.map((o) => [o, catLabel(k, o)]);
	const cur = g[k];
	if (standard(cur) && !values.includes(cur))
		list.unshift([cur, catLabel(k, cur)]);
	list.push(["andere", "Anderer Wert"]);
	if (d !== "wmz" || k === "fg")
		list.push(["unbekannt", k === "fg" ? "Weiß ich nicht" : "Unbekannt"]);
	return list;
}

/**
 * After `k` changed (`casFix`): later fields that no longer fit are cleared,
 * an empty one with a single fitting value is set. Returns the fields set.
 * For heat meters on plaster, the thread follows when only one fits.
 */
export function fitFields(id: CatId, g: Group, k: CatKey): CatKey[] {
	const order = FIELDS[id];
	const i = order.indexOf(k);
	const set: CatKey[] = [];
	if (i < 0) return set;
	for (const f of order.slice(i + 1)) {
		const values = fieldValues(id, g, f);
		if (standard(g[f]) && !values.includes(g[f])) g[f] = "";
		if (!g[f] && standard(g[k]) && values.length === 1) {
			g[f] = values[0];
			set.push(f);
		}
	}
	if (id === "wmzap") {
		const fit = CATALOG.wmzap.filter((r) =>
			(["qp", "dn", "bl"] as const).every(
				(f) => !standard(g[f]) || r[f] === g[f],
			),
		);
		const threads = new Set(fit.map((r) => r.gew));
		if (threads.size === 1) g.gew = [...threads][0] ?? "";
	}
	return set;
}

/** The free values outside the catalog, "<label> <value>" (`sonder`). */
export function specialSizes(d: string, g: Group): string[] {
	const id = catalogOf(d, g);
	if (!id) return [];
	return FIELDS[id]
		.filter((k) => g[k] === "andere" && String(g[`${k}x`] ?? "").trim())
		.map((k) => {
			const x = String(g[`${k}x`]).trim();
			return `${FIELD_LABELS[k]} ${k === "q3" ? `${x} m³/h` : /^[\d.,]+$/.test(x) ? catLabel(k, x) : x}`;
		});
}
