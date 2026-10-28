/**
 * The example series of the KPI cards "Kosten" and "Einsparung", as the
 * design computes them (plan 01 §1.4). Example data: sign-off in plan §4.4.
 */

export const MONTHS_SHORT = [
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

export const MONTHS_LONG = [
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember",
];

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** Heating units per month 2025, scaled so the year sums to 6,72 €/m². */
const HEAT_UNITS = [48, 62, 78, 84, 70, 55, 34, 22, 16, 15, 15, 30];
const HEAT_FACTOR = 6.72 / sum(HEAT_UNITS);
/** The other operating costs, the same every month, €/m². */
export const REST_PER_MONTH = 0.48;

const heat = HEAT_UNITS.map((u) => u * HEAT_FACTOR);
const all = heat.map((h) => h + REST_PER_MONTH);

/** Costs 2025 in €/m²: heating and in total, per month and for the year. */
export const costs = {
	year: 2025,
	heat,
	all,
	heatTotal: sum(heat),
	allTotal: sum(all),
};

/** CO₂ saved per month, January to September 2026, t. */
const CO2_MONTHLY = [1.85, 1.7, 1.55, 1.25, 1.05, 0.95, 0.9, 0.95, 1.1];

const cumulative: number[] = [];
CO2_MONTHLY.reduce((acc, v) => {
	const next = Math.round((acc + v) * 100) / 100;
	cumulative.push(next);
	return next;
}, 0);

export const co2 = {
	year: 2026,
	monthly: CO2_MONTHLY,
	cumulative,
	total: cumulative[cumulative.length - 1],
};
