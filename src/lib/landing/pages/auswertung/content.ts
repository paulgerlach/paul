/**
 * Every text and the example data of /plattform/auswertung, word for word from the
 * design (https://claude.ai/artifact/1qV4qjvQqWxzL76fobN5Hs). Components hold
 * markup and behaviour only; the math is in `metrics.ts`.
 *
 * The product description and the example data need sign-off before the
 * cutover (plan §4.4).
 */
import { DEMO_HREF, START_HREF } from "$lib/landing/cta";
import {
	closing as dashboardClosing,
	type ClosingContent,
} from "$lib/landing/pages/dashboard/content";
import type { IconName } from "$lib/landing/pages/dashboard/icons";

const NB = " ";

export const hero = {
	pill: "Heidi Auswertung",
	h1: ["Ihre Verbräuche.", "Klar ausgewertet."],
	line: "Heidi wertet die Funkdaten aller Zähler für jede Liegenschaft aus.",
	primary: { text: "Demo buchen", href: DEMO_HREF },
	// The design links a quote page that doesn't exist (plan README, open question 1).
	secondary: { text: "Angebot einholen", href: START_HREF },
};

export type Property = { name: string; units: number };

/** The example portfolio, in the design's order. */
export const properties: Property[] = [
	{ name: "Lindenallee 12", units: 36 },
	{ name: "Gartenweg 3", units: 12 },
	{ name: "Bergmannstraße 4", units: 24 },
	{ name: "Am Stadtpark 7", units: 32 },
	{ name: "Mühlenstraße 18", units: 18 },
	{ name: "Schillerhöfe", units: 48 },
	{ name: "Hofstraße 21", units: 18 },
];

export type MetricKey = "heiz" | "ww" | "kw";

export type Metric = {
	label: string;
	unit: string;
	/** One value per property, in `properties`' order. */
	values: number[];
	digits: number;
};

/** The design's `MET`. */
export const metrics: Record<MetricKey, Metric> = {
	heiz: {
		label: "Heizung",
		unit: "kWh/m²",
		values: [118, 96, 142, 104, 88, 131, 99],
		digits: 0,
	},
	ww: {
		label: "Warmwasser",
		unit: "m³/WE",
		values: [14.2, 11.8, 17.6, 12.9, 10.4, 16.1, 13.0],
		digits: 1,
	},
	kw: {
		label: "Kaltwasser",
		unit: "m³/WE",
		values: [31.5, 28.0, 38.2, 30.1, 26.4, 35.7, 29.8],
		digits: 1,
	},
};

export const METRIC_KEYS: MetricKey[] = ["heiz", "ww", "kw"];

export const period = "Jan – Okt";

export type Tone = "g" | "o";

export const mock = {
	label: "Beispiel: Auswertung eines Portfolios mit Vergleich und Hinweisen",
	title: "Auswertung",
	sub: "Portfolio · 7 Liegenschaften · 188 Einheiten",
	chip: period,
	tag: "Beispieldaten",
	export: "Report exportieren",
	kpis: [
		{
			label: "Heizung im Schnitt",
			value: 111,
			digits: 0,
			unit: "kWh/m²",
			delta: `−7${NB}% zum Vorjahr`,
			tone: "g",
		},
		{
			label: "Warmwasser im Schnitt",
			value: 13.7,
			digits: 1,
			unit: "m³/WE",
			delta: `−4${NB}% zum Vorjahr`,
			tone: "g",
		},
		{
			label: "Hinweise offen",
			value: 3,
			digits: 0,
			delta: "1 dringend",
			tone: "o",
		},
	] satisfies {
		label: string;
		value: number;
		digits: number;
		unit?: string;
		delta: string;
		tone: Tone;
	}[],
	chartTitle: "Heizung je m² im Vergleich",
	/** "Ø Portfolio 111": the heating values' average. */
	average: "Ø Portfolio",
	notes: [
		{
			mark: "!",
			urgent: true,
			title: "Bergmannstraße 4",
			text: `28${NB}% über dem Portfolio-Schnitt`,
		},
		{
			mark: "↓",
			urgent: false,
			title: "Mühlenstraße 18",
			text: "Niedrigster Verbrauch je m²",
		},
		{
			mark: "↗",
			urgent: false,
			title: "Schillerhöfe",
			text: "Warmwasser seit Februar über Vorjahr",
		},
	],
};

export const steps = {
	pill: { text: "So entsteht die Auswertung", icon: "sparkle" as IconName },
	h2: "Von der Funkablesung zur Kennzahl. Automatisch.",
	lead: "Bevor ein Wert in Ihrer Auswertung landet, prüft Heidi ihn. So rechnen Sie mit Zahlen, auf die Sie sich verlassen können.",
	cards: [
		{
			n: "01",
			icon: "signal" as IconName,
			title: "Funkwerte",
			text: "Alle Zähler senden ihre Werte per Funk. Ohne Termin in der Wohnung, ohne Ablesezettel.",
			tickers: [
				{ text: "HKV 0412 · 2.180", warn: false },
				{ text: "WWZ 0081 · 18,4 m³", warn: false },
			],
		},
		{
			n: "02",
			icon: "check" as IconName,
			title: "Plausibel geprüft",
			text: "Heidi gleicht jeden Wert mit Vormonat und Vorjahr ab und markiert Lücken und Ausreißer.",
			tickers: [
				{ text: "12.480 Werte plausibel", warn: false },
				{ text: "3 Werte markiert", warn: true },
			],
		},
		{
			n: "03",
			icon: "chart" as IconName,
			title: "Kennzahlen und Berichte",
			text: "Aus den geprüften Werten entstehen Kennzahlen je Wohnung, Liegenschaft und Portfolio.",
			tickers: [
				{ text: "111 kWh/m² Heizung", warn: false },
				{ text: "Report Q3 bereit", warn: false },
			],
		},
	],
};

export const compare = {
	pill: { text: "Vergleich", icon: "building" as IconName },
	h2: "Welche Liegenschaft fällt aus der Reihe?",
	text: "Heidi stellt alle Liegenschaften nebeneinander, bezogen auf Fläche oder Wohneinheit. So sehen Sie sofort, wo der Verbrauch über dem Schnitt Ihres Portfolios liegt und wo nicht.",
	list: [
		"Heizung je m², Wasser je Wohneinheit",
		"Vergleich mit dem Schnitt Ihres Portfolios",
		"Sortiert nach Abweichung",
	],
	switchLabel: "Kennzahl",
	units: (n: number) => `${n} Einheiten`,
	above: "über Ø",
	below: "unter Ø",
	demo: "Beispieldaten",
	/** The polite line after a switch. */
	top: (name: string, value: string) => `Höchster Wert: ${name}, ${value}`,
};

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

export const heatmap = {
	pill: { text: "Jahresverlauf", icon: "clock" as IconName },
	h2: "Das ganze Jahr auf einen Blick",
	lead: "Jedes Feld zeigt, wie stark der Heizverbrauch eines Monats vom Vorjahr abweicht. Ausreißer springen sofort ins Auge.",
	/** Deviation from the previous year in %, per property and month. */
	rows: [
		[-4, -1, 7, -3, -2, 0, -10, -2, 0, 4, -12, -7],
		[-12, 5, 2, -13, 9, 8, -15, 0, -10, -14, -2, -13],
		[-10, -8, -13, -3, -4, 5, -2, 1, -3, 1, 24, 17],
		[9, 9, 5, 2, -7, -9, -7, -12, 4, -5, 5, -5],
		[8, 5, -13, -9, 7, -3, 9, -5, -12, 0, 4, -8],
		[12, 19, 8, 3, -11, -8, -12, -13, 4, -10, -1, -4],
		[-10, 3, -11, 1, -11, -4, -9, -8, 8, 4, -7, 6],
	],
	less: "weniger als Vorjahr",
	more: "mehr als Vorjahr",
	demo: "Beispieldaten",
	caption:
		"Heizverbrauch je Monat im Vergleich zum Vorjahr in Prozent (Beispieldaten)",
};

export type HintKind = "w" | "h" | "t";
export type HintFilter = "all" | HintKind;

export type Hint = {
	kind: HintKind;
	/** The strip's colour: orange, yellow, blue, green. */
	tone: "o" | "y" | "b" | "g";
	place: string;
	title: string;
	text: string;
	action: string;
};

export const hints = {
	pill: { text: "Hinweise", icon: "bell" as IconName },
	h2: "Nicht nur Zahlen. Konkrete nächste Schritte.",
	text: "Heidi erkennt ungewöhnliche Verläufe, zum Beispiel einen tropfenden Spülkasten oder einen Zähler ohne Signal, und sagt Ihnen, was zu tun ist. Dringendes steht oben.",
	list: [
		"Leckageverdacht aus dem Nachtverbrauch",
		"Abweichungen zum Vorjahr",
		"Zähler ohne Funksignal",
	],
	title: "Hinweise",
	filterLabel: "Filter",
	filters: [
		{ value: "all", label: "Alle" },
		{ value: "w", label: "Wasser" },
		{ value: "h", label: "Heizung" },
		{ value: "t", label: "Technik" },
	] satisfies { value: HintFilter; label: string }[],
	items: [
		{
			kind: "w",
			tone: "o",
			place: "Wasser · Gartenweg 3 · WE 04",
			title: "Leckageverdacht",
			text: "An 3 Tagen lief nachts durchgehend Wasser.",
			action: "Spülkasten prüfen lassen",
		},
		{
			kind: "h",
			tone: "o",
			place: "Heizung · Bergmannstraße 4 · November",
			title: "Verbrauch deutlich höher",
			text: `24${NB}% mehr als im Vorjahresmonat.`,
			action: "Heizungseinstellung prüfen",
		},
		{
			kind: "t",
			tone: "b",
			place: "Technik · Schillerhöfe · WE 17",
			title: "Zähler ohne Signal",
			text: "Seit 6 Tagen keine Funkwerte.",
			action: "Heidi plant einen Termin",
		},
		{
			kind: "w",
			tone: "y",
			place: "Wasser · Schillerhöfe",
			title: "Warmwasser über Vorjahr",
			text: "Seit Februar über dem Vorjahreswert.",
			action: "Verlauf beobachten",
		},
		{
			kind: "h",
			tone: "g",
			place: "Heizung · Mühlenstraße 18",
			title: "Verbrauch gesunken",
			text: `13${NB}% weniger als im Vorjahr.`,
			action: "Kein Handlungsbedarf",
		},
	] satisfies Hint[],
	count: (n: number) => (n === 1 ? "1 Hinweis" : `${n} Hinweise`),
};

export const report = {
	pill: { text: "Berichte", icon: "file" as IconName },
	h2: "Ein Bericht für Eigentümer. In wenigen Klicks.",
	text: "Liegenschaft und Zeitraum wählen, Heidi erstellt den Bericht mit Kennzahlen, Verlauf und Hinweisen. Als PDF zum Versenden, als Tabelle zum Weiterrechnen oder direkt in Ihre Software.",
	formats: [
		{ icon: "file" as IconName, text: "PDF" },
		{ icon: "chart" as IconName, text: "Excel" },
		{ icon: "link" as IconName, text: "ERP und CRM" },
	],
	doc: {
		title: "Verbrauchsbericht Q3",
		sub: "Lindenallee 12 · 36 Einheiten",
		kpis: [
			{ label: "Heizung", value: "104", unit: "kWh/m²" },
			{ label: "Warmwasser", value: "12,9", unit: "m³/WE" },
			{ label: "zum Vorjahr", value: `−7${NB}%`, good: true },
		] as { label: string; value: string; unit?: string; good?: boolean }[],
		/** Bar heights in % of the chart. */
		bars: [82, 74, 60, 44, 28, 18, 15, 17, 30],
		checks: ["Keine offenen Hinweise", "Alle 112 Zähler übertragen"],
		demo: "Beispieldaten",
	},
	done: "Bericht erstellt",
};

export const closing: ClosingContent = {
	...dashboardClosing,
	h2: "Sehen Sie, was in Ihren",
	h2Accent: "Verbräuchen steckt.",
	text: "Wir zeigen Ihnen in einer Demo, wie Ihr Bestand in der Heidi Auswertung aussieht.",
	submitLabel: "Bestand kostenlos prüfen",
};
