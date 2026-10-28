/**
 * The example data of the dashboard preview, from the design's "Echtes
 * Dashboard" script (plan 01 §1.4). Everything here is fixed example data
 * (sign-off in plan §4.4); the meters are generated from seeds, as in the
 * design, but with an integer PRNG so the server and every browser agree.
 */
import type { IconName } from "../icons";

/** A deterministic number in [0, 1) for a seed (one step of mulberry32). */
export function rnd(seed: number): number {
	let t = (Math.round(seed * 1000) + 0x6d2b79f5) | 0;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export type DemoObject = {
	id: string;
	name: string;
	units: number;
	/** Share of meters with Heidi radio, %. */
	radio: number;
	/** Consumption change to the previous year, %. */
	delta: number;
	/** Added in the preview ("Objekt anlegen"). */
	isNew?: boolean;
};

export const OBJECTS: DemoObject[] = [
	{ id: "bm", name: "Bergmannstraße 4", units: 24, radio: 100, delta: -6.8 },
	{ id: "la", name: "Lindenallee 12", units: 18, radio: 100, delta: -3.1 },
	{ id: "sp", name: "Am Stadtpark 7", units: 32, radio: 72, delta: 2.4 },
	{ id: "gw", name: "Gartenweg 3", units: 12, radio: 100, delta: -9.2 },
	{ id: "ms", name: "Mühlenstraße 18", units: 18, radio: 0, delta: 4.1 },
	{ id: "wk", name: "Wohnpark Am Kanal", units: 140, radio: 94, delta: -5.6 },
	{ id: "sh", name: "Schillerhöfe", units: 126, radio: 88, delta: -1.9 },
];

export const TOTAL_UNITS = 370;

export const METER_TYPES = {
	hkv: { label: "Heizkostenverteiler", short: "HKV", icon: "hkv" },
	ww: { label: "Warmwasserzähler", short: "WWZ", icon: "tapHot" },
	kw: { label: "Kaltwasserzähler", short: "KWZ", icon: "tap" },
	wmz: { label: "Wärmemengenzähler", short: "WMZ", icon: "radiator" },
} as const satisfies Record<
	string,
	{ label: string; short: string; icon: IconName }
>;

export type MeterType = keyof typeof METER_TYPES;
export const METER_TYPE_KEYS = Object.keys(METER_TYPES) as MeterType[];

export type Meter = {
	id: string;
	type: MeterType;
	object: string;
	/** Unit number, 0 for the cellar (WMZ). */
	unit: number;
	label: string;
	reading: string;
	radio: boolean;
	last: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const deFixed = (n: number, d: number) =>
	n.toLocaleString("de-DE", {
		minimumFractionDigits: d,
		maximumFractionDigits: d,
	});

/** The design's extract of meters: up to eight units per object. */
export const METERS: Meter[] = OBJECTS.flatMap((o, oi) => {
	const out: Meter[] = [];
	const make = (type: MeterType, unit: number, k: number) => {
		const r = rnd(oi * 100 + k);
		const reading =
			type === "hkv"
				? `${Math.round(180 + r * 420)} Einh.`
				: type === "wmz"
					? `${deFixed(Math.round(8 + r * 40), 0)} MWh`
					: `${deFixed(10 + r * 60, 1)} m³`;
		out.push({
			id: `${METER_TYPES[type].short}-${4400 + oi * 137 + k}-${pad(unit)}`,
			type,
			object: o.id,
			unit,
			label: unit ? `WE ${pad(unit)}` : "Keller",
			reading,
			radio: r * 100 < o.radio || o.radio >= 90,
			last: "05.10.2026",
		});
	};
	for (let w = 1; w <= Math.min(o.units, 8); w++) {
		make("hkv", w, w * 4);
		make("hkv", w, w * 4 + 1);
		make("ww", w, w * 4 + 2);
		make("kw", w, w * 4 + 3);
	}
	make("wmz", 0, 99);
	return out;
});

export const MONTHS = [
	"Jan",
	"Feb",
	"Mär",
	"Apr",
	"Mai",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Okt",
	"Nov",
	"Dez",
];

export type SeriesKey = "kalt" | "warm" | "heiz" | "hk";

/** Monthly values 2026 (to October) and 2025, for all 370 units. */
export const BASE: Record<SeriesKey, number[]> = {
	kalt: [28, 62, 88, 98, 230, 232, 226, 250, 262, 284, 0, 0],
	warm: [19, 20, 24, 30, 96, 78, 66, 78, 88, 99, 0, 0],
	heiz: [
		98000, 92000, 78000, 60000, 52000, 40000, 22000, 62000, 85000, 96000, 0, 0,
	],
	hk: [460, 420, 390, 250, 120, 40, 25, 30, 110, 265, 0, 0],
};

export const PREV: Record<SeriesKey, number[]> = {
	kalt: [42, 60, 84, 110, 180, 215, 240, 236, 250, 226, 120, 60],
	warm: [26, 24, 28, 34, 70, 82, 80, 84, 90, 70, 40, 30],
	heiz: [
		104000, 97000, 84000, 64000, 55000, 45000, 26000, 64000, 90000, 72000,
		80000, 98000,
	],
	hk: [520, 470, 410, 280, 140, 50, 30, 35, 130, 320, 430, 500],
};

/** The forecast tile, MWh: actuals Jan–Okt, then forecast and band Okt–Dez. */
export const FORECAST = {
	actual: [118, 104, 92, 70, 48, 30, 22, 24, 40, 66],
	forecast: [66, 88, 108, 122],
	low: [66, 80, 94, 104],
	high: [66, 96, 122, 140],
	/** Index of the month the forecast starts from ("HEUTE"). */
	today: 9,
};

export type PeriodKey = "ytd" | "q3" | "y25";

export type Period = {
	key: PeriodKey;
	/** Name in the period menu. */
	name: string;
	label: string;
	/** Month range [from, to) into the series. */
	months: [number, number];
	year: 2025 | 2026;
};

export const PERIODS: Period[] = [
	{
		key: "ytd",
		name: "Dieses Jahr",
		label: "01. Jan. – 04. Okt.",
		months: [0, 10],
		year: 2026,
	},
	{
		key: "q3",
		name: "Letztes Quartal",
		label: "01. Jul. – 30. Sep.",
		months: [6, 9],
		year: 2026,
	},
	{
		key: "y25",
		name: "Vorjahr",
		label: "01. Jan. – 31. Dez. 2025",
		months: [0, 12],
		year: 2025,
	},
];

/** CO₂ saved, t, for all objects per period. */
export const CO2_BY_PERIOD: Record<PeriodKey, number> = {
	ytd: 11.3,
	q3: 2.4,
	y25: 13.9,
};

export const FLOORS = [
	"EG li.",
	"EG re.",
	"1. OG li.",
	"1. OG re.",
	"2. OG li.",
	"2. OG re.",
];

export type DocCategory = "abr" | "uvi" | "prot";

export type DemoDocument = {
	category: DocCategory;
	title: string;
	object: string;
	date: string;
	detail: string;
	/** Created in the preview. */
	isNew?: boolean;
};

export const DOCUMENTS: DemoDocument[] = [
	{
		category: "abr",
		title: "Heizkostenabrechnung 2025",
		object: "bm",
		date: "12.03.2026",
		detail: "PDF · 24 Einzelabrechnungen",
	},
	{
		category: "abr",
		title: "Heizkostenabrechnung 2025",
		object: "la",
		date: "12.03.2026",
		detail: "PDF · 18 Einzelabrechnungen",
	},
	{
		category: "uvi",
		title: "Verbrauchsinformation September",
		object: "wk",
		date: "01.10.2026",
		detail: "140 Mietparteien",
	},
	{
		category: "uvi",
		title: "Verbrauchsinformation September",
		object: "sh",
		date: "01.10.2026",
		detail: "126 Mietparteien",
	},
	{
		category: "prot",
		title: "Montageprotokoll",
		object: "sp",
		date: "18.06.2026",
		detail: "32 Wohnungen",
	},
	{
		category: "abr",
		title: "Betriebskostenabrechnung 2025",
		object: "gw",
		date: "28.04.2026",
		detail: "PDF",
	},
	{
		category: "prot",
		title: "Zählerwechsel-Protokoll",
		object: "ms",
		date: "02.09.2026",
		detail: "12 Zähler",
	},
];

export const DOC_CATEGORIES: { key: "all" | DocCategory; label: string }[] = [
	{ key: "all", label: "Alle" },
	{ key: "abr", label: "Abrechnungen" },
	{ key: "uvi", label: "Verbrauchsinfo" },
	{ key: "prot", label: "Protokolle" },
];

/** The date generated documents carry. */
export const TODAY = "05.10.2026";

export type BillingFunction = "bk" | "uvi" | "hk" | "rm" | "fl";

export const BILLING_FUNCTIONS: {
	key: BillingFunction;
	label: string;
	icon: IconName;
}[] = [
	{ key: "bk", label: "Betriebskosten", icon: "euro" },
	{ key: "uvi", label: "uVI hinzufügen", icon: "filePlus" },
	{ key: "hk", label: "Heizkostenabrechnung", icon: "file" },
	{ key: "rm", label: "Rauchmelder hinzufügen", icon: "smoke" },
	{ key: "fl", label: "Feuerlöscher hinzufügen", icon: "extinguisher" },
];

/** "Betriebskosten": the object's cost types, € (example values). */
export const OPERATING_COSTS: [string, number][] = [
	["Grundsteuer", 1840],
	["Wasser / Abwasser", 4210],
	["Müllabfuhr", 1960],
	["Hausreinigung", 2380],
	["Gartenpflege", 920],
	["Allgemeinstrom", 640],
	["Versicherungen", 2150],
];

export const BILLING_STEPS = [
	"Verbräuche laden",
	"Plausibilität prüfen",
	"Kosten nach HKVO verteilen",
	"Einzelabrechnungen erzeugen",
];

export const SMOKE_ROOMS = [
	"Schlafzimmer",
	"Kinderzimmer",
	"Flur",
	"Wohnzimmer",
];
export const EXTINGUISHER_PLACES = [
	"Treppenhaus EG",
	"Treppenhaus 1. OG",
	"Keller",
	"Tiefgarage",
];
export const UVI_MONTHS = ["September 2026", "August 2026"];
