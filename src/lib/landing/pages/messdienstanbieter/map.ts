/**
 * The Germany map (plan §8.3): the 16 Bundesländer from the design, plus a
 * dot for every live city page, linking to it. The dots and the "Eigene
 * Seiten: …" hints are built from `CITIES`, so the map never links to a page
 * that isn't live and never names one.
 */
import {
	CITIES,
	type CityEntry,
} from "$lib/landing/pages/messdienstanbieter-city/cities";
import type {
	MapDistrict,
	MapGeometry,
	MapLabel,
	MapShape,
} from "$lib/landing/sections/region/types";
import { cityRoute } from "$lib/routes";
import data from "./germany-map";

type State = {
	name: string;
	shape: MapShape;
	label?: MapLabel;
	stock: string;
} & (
	| { hint: string }
	/** The hint lists the state's live city pages, then `suffix`. */
	| { cityHint: { suffix?: string } }
);

export type GermanyMapData = Omit<MapGeometry, "districts" | "marker"> & {
	states: State[];
	/** Dot of each city, by slug (also those without a page yet). */
	cityDots: Record<
		string,
		{ cx: number; cy: number; r: number; label?: MapLabel }
	>;
};

/**
 * Hints for states whose city pages aren't live (yet). Not in the design:
 * written in the style of its other state hints, to be signed off by the
 * content owner (plan, open question 8).
 */
export const FALLBACK_HINTS: Record<string, string> = {
	"Baden-Württemberg":
		"Montage und Mieterinformation koordiniert Heidi, auch bei vielen kleinen Objekten.",
	Bayern:
		"Funkablesung ohne Wohnungstermin, von der Altbauwohnung bis zur Wohnanlage.",
	Berlin: "Heidi übernimmt alte und neue Zählertechnik im selben Portfolio.",
	Bremen:
		"Bestehende Zähler sofort übernehmen, getauscht wird erst bei Vertragsende.",
	Hamburg:
		"Rotklinker oder Großsiedlung, ein Ablauf: Analyse, Pilotobjekt, dann der Bestand.",
	Hessen:
		"Heizkostenabrechnung auf Knopfdruck, direkt übergeben an Ihre Verwaltungssoftware.",
	Niedersachsen:
		"Die monatliche Verbrauchsinformation erhalten alle Mieter automatisch.",
	"Nordrhein-Westfalen":
		"Zechensiedlung oder Gründerzeit: Heidi plant Montagefenster von 1–2 Stunden pro Wohnung.",
	Sachsen:
		"Plattenbau mit vielen Einheiten: Rollout im Cluster in wenigen Wochen.",
};

/** "A", "A und B", "A, B und C" */
export const germanList = (items: string[]) =>
	items.length < 2
		? (items[0] ?? "")
		: `${items.slice(0, -1).join(", ")} und ${items.at(-1)}`;

/** "Eigene Seite: Berlin." / "Eigene Seiten: Leipzig und Dresden." (+ suffix) */
export function cityHint(
	state: string,
	cities: readonly CityEntry[],
	suffix?: string,
) {
	const names = cities.filter((c) => c.state === state).map((c) => c.name);
	if (!names.length) return undefined;
	const sentence = `Eigene Seite${names.length > 1 ? "n" : ""}: ${germanList(names)}.`;
	return suffix ? `${sentence} ${suffix}` : sentence;
}

export function germanyMap(
	{ states, cityDots, ...geometry }: GermanyMapData,
	cities: readonly CityEntry[] = CITIES.filter((c) => c.live),
): MapGeometry {
	const stateDistricts: MapDistrict[] = states.map((s) => {
		const { name, shape, label, stock } = s;
		const hint =
			"hint" in s
				? s.hint
				: (cityHint(name, cities, s.cityHint.suffix) ?? FALLBACK_HINTS[name]);
		if (!hint) throw new Error(`No hint for ${name}`);
		return { name, shape, label, stock, hint };
	});
	const dots: MapDistrict[] = cities.flatMap((city) => {
		const dot = cityDots[city.slug];
		if (!dot) return [];
		return {
			id: `city:${city.slug}`,
			name: city.name,
			href: cityRoute(city.slug),
			shape: { kind: "dot", cx: dot.cx, cy: dot.cy, r: dot.r },
			label: dot.label,
			stock: `Eigene Landingpage für Hausverwaltungen in ${city.name}`,
			hint: `Klicken Sie auf den Punkt, um die Seite für ${city.name} zu öffnen.`,
		};
	});
	return { ...geometry, districts: [...stateDistricts, ...dots] };
}

export default germanyMap(data);
