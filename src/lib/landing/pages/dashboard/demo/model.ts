/**
 * What the dashboard preview shows for a given state, as pure functions of
 * the example data (plan 01 §1.4): the same numbers on the server and in the
 * browser, unit-tested.
 */
import { de, expand, formatNumber, type Granularity } from "../chart";
import {
	BASE,
	CO2_BY_PERIOD,
	type DemoDocument,
	type DemoObject,
	type DocCategory,
	FLOORS,
	FORECAST,
	type Meter,
	type MeterType,
	METER_TYPES,
	MONTHS,
	type Period,
	PERIODS,
	PREV,
	rnd,
	type SeriesKey,
	TOTAL_UNITS,
} from "./data";

const NB = "\u00a0";

export type ChartState = {
	scope: string | null;
	period: Period;
	granularity: Granularity;
	objects: DemoObject[];
};

export const DEFAULT_PERIOD = PERIODS[0];

export function scopeObject(state: {
	scope: string | null;
	objects: DemoObject[];
}): DemoObject | null {
	return state.objects.find((o) => o.id === state.scope) ?? null;
}

/** A scoped object's share of the portfolio, with a little per-series spread. */
function factor(key: string, state: ChartState): number {
	const o = scopeObject(state);
	if (!o) return 1;
	return (
		(o.units / TOTAL_UNITS) * (1 + (rnd(o.units + key.length) - 0.5) * 0.2)
	);
}

/** A tile's monthly values in the period (or the year before), scaled to the scope. */
export function series(
	key: SeriesKey,
	state: ChartState,
	previous = false,
): { values: number[]; labels: string[] } {
	const source = state.period.year === 2025 || previous ? PREV : BASE;
	const [from, to] = state.period.months;
	const f = factor(key, state);
	return {
		values: source[key].slice(from, to).map((v) => v * f),
		labels: MONTHS.slice(from, to),
	};
}

/** The values a chart draws: per month, week or day. */
export function chartValues(
	key: SeriesKey,
	state: ChartState,
	previous = false,
	seedOffset = 0,
): number[] {
	return expand(
		series(key, state, previous).values,
		state.granularity,
		key.length + seedOffset,
	);
}

/** The previous year's line can be shown only for a 2026 period. */
export function canShowPreviousYear(state: ChartState): boolean {
	return state.period.year === 2026;
}

/** The tooltip's name of point `i`. */
export function pointLabel(
	i: number,
	labels: string[],
	state: Pick<ChartState, "granularity" | "period">,
): string {
	if (state.granularity === "m") return `${labels[i]} ${state.period.year}`;
	if (state.granularity === "w")
		return `KW ${Math.trunc(state.period.months[0] * 4.35 + i + 1)}`;
	return `${labels[Math.floor(i / 7)]}, Tag ${(i % 7) + 1}`;
}

/** Devices per type in the scope (two HKV, one WWZ and KWZ per unit, one WMZ per object). */
export function typeCounts(
	objects: DemoObject[],
	scope: string | null,
): Record<MeterType, number> {
	const list = scope ? objects.filter((o) => o.id === scope) : objects;
	const counts = { hkv: 0, ww: 0, kw: 0, wmz: 0 };
	for (const o of list) {
		counts.hkv += o.units * 2;
		counts.ww += o.units;
		counts.kw += o.units;
		counts.wmz += 1;
	}
	return counts;
}

/** CO₂ saved in the period, t, and the line under it. */
export function co2(state: Omit<ChartState, "granularity">): {
	value: number;
	sub: string;
} {
	const o = scopeObject(state);
	const base = CO2_BY_PERIOD[state.period.key];
	return {
		value: base * (o ? o.units / TOTAL_UNITS : 1),
		sub: state.period.year === 2025 ? "im Jahr 2025" : "im gewählten Zeitraum",
	};
}

export type PerObjectRow = {
	name: string;
	cold: number;
	warm: number;
	/** Set when the row filters the dashboard to that object. */
	object?: string;
};

/** "Verbrauch pro Objekt" (the five largest) or, in an object, "pro Wohneinheit". */
export function perObject(state: Omit<ChartState, "granularity">): {
	title: string;
	rows: PerObjectRow[];
} {
	const o = scopeObject(state);
	const yf =
		state.period.key === "q3" ? 0.3 : state.period.year === 2025 ? 1.15 : 1;
	if (!o) {
		const largest = state.objects
			.slice()
			.sort((a, b) => b.units - a.units)
			.slice(0, 5);
		return {
			title: "Verbrauch pro Objekt",
			rows: largest.map((x, i) => ({
				name: x.name,
				cold: (24 + rnd(i + 3) * 20) * yf,
				warm: (16 + rnd(i + 9) * 14) * yf,
				object: x.id,
			})),
		};
	}
	const street = o.name.split(" ")[0];
	return {
		title: "Verbrauch pro Wohneinheit",
		rows: FLOORS.slice(0, Math.min(5, o.units)).map((floor, i) => ({
			name: `${floor} ${street}`,
			cold: (22 + rnd(o.units + i) * 24) * yf,
			warm: (14 + rnd(o.units * 2 + i) * 16) * yf,
		})),
	};
}

/** The forecast tile: actuals and, in 2026, the forecast with its band. */
export function forecast(state: Omit<ChartState, "granularity">): {
	actual: number[];
	forecast: number[];
	low: number[];
	high: number[];
	full: boolean;
} {
	const f = factor("prog", { ...state, granularity: "m" });
	const full = state.period.year === 2025;
	const scale = (v: number[]) => v.map((x) => x * f);
	return {
		actual: full
			? PREV.heiz.map((x) => (x / 1000) * 1.4 * f)
			: scale(FORECAST.actual),
		forecast: full ? [] : scale(FORECAST.forecast),
		low: full ? [] : scale(FORECAST.low),
		high: full ? [] : scale(FORECAST.high),
		full,
	};
}

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** The enlarged chart's summary: sum, monthly mean and the change to the year before. */
export function tileSummary(
	key: SeriesKey,
	state: ChartState,
): { sum: number; mean: number; delta: number | null } {
	const current = series(key, state);
	const total = sum(current.values);
	const previous = canShowPreviousYear(state)
		? sum(series(key, state, true).values)
		: null;
	return {
		sum: total,
		mean: total / current.values.length,
		delta: previous ? ((total - previous) / previous) * 100 : null,
	};
}

/** Meters of a type (or all) in the scope whose number, object or unit matches. */
export function metersFor(
	meters: Meter[],
	objects: DemoObject[],
	type: "all" | MeterType,
	scope: string | null,
	query: string,
): Meter[] {
	const q = query.trim().toLowerCase();
	const names = new Map(objects.map((o) => [o.id, o.name]));
	return meters.filter(
		(m) =>
			(type === "all" || m.type === type) &&
			(!scope || m.object === scope) &&
			(!q ||
				`${m.id} ${names.get(m.object) ?? ""} ${m.label}`
					.toLowerCase()
					.includes(q)),
	);
}

export function documentsFor(
	documents: DemoDocument[],
	category: "all" | DocCategory,
	scope: string | null,
): DemoDocument[] {
	return documents.filter(
		(d) =>
			(category === "all" || d.category === category) &&
			(!scope || d.object === scope),
	);
}

export function objectsMatching(objects: DemoObject[], query: string) {
	const q = query.trim().toLowerCase();
	return objects.filter((o) => !q || o.name.toLowerCase().includes(q));
}

/** A meter's nine monthly values for the drawer (example data). */
export function meterHistory(meter: Meter): number[] {
	return Array.from(
		{ length: 9 },
		(_, i) => 20 + rnd(meter.id.length * 7 + i + meter.unit) * 80,
	);
}

/** A chart's text alternative: what, when, how fine, the range and the last value. */
export function describeChart(
	title: string,
	unit: string,
	values: number[],
	labels: string[],
	state: Pick<ChartState, "granularity" | "period">,
): string {
	if (!values.length) return `${title}: keine Werte`;
	const granularity = { d: "täglich", w: "wöchentlich", m: "monatlich" }[
		state.granularity
	];
	const range = `${labels[0]} bis ${labels[labels.length - 1]} ${state.period.year}`;
	const min = formatNumber(Math.min(...values));
	const max = formatNumber(Math.max(...values));
	const last = formatNumber(values[values.length - 1]);
	return `${title}, ${range}, ${granularity}: ${min} bis ${max} ${unit}, zuletzt ${last} ${unit}`;
}

export function meterTypeLabel(type: MeterType): string {
	return METER_TYPES[type].label;
}

/** "−6,8 %" / "+2,4 %" with the design's arrows. */
export function deltaText(delta: number): string {
	if (delta === 0) return "–";
	return `${delta < 0 ? "↘ −" : "↗ +"}${de(Math.abs(delta), 1)}${NB}%`;
}
