/**
 * The risk calculator of /upgrade-now: what tenants may cut (3 % of the
 * heating and hot-water costs of the units without remote-readable devices,
 * § 12 Abs. 1 HeizkostenV) per billing period. Pure, no DOM.
 */

/** Slider stops for the number of units: 2–19, 20–95 by 5, 100–490 by 10, 500–2000 by 50. */
export const UNIT_STOPS: number[] = [];
for (let v = 2; v < 20; v++) UNIT_STOPS.push(v);
for (let v = 20; v < 100; v += 5) UNIT_STOPS.push(v);
for (let v = 100; v < 500; v += 10) UNIT_STOPS.push(v);
for (let v = 500; v <= 2000; v += 50) UNIT_STOPS.push(v);

export const DEFAULT_UNITS = 120;
export const DEFAULT_UNIT_INDEX = UNIT_STOPS.indexOf(DEFAULT_UNITS);

/** Heating and hot-water costs per unit and year, €. */
export const COST = { min: 400, max: 3000, step: 50, default: 1000 };

/** Share of the units that aren't remotely readable yet. */
export const SHARES = [
	{ value: 0.25, label: "25\u00a0%" },
	{ value: 0.5, label: "50\u00a0%" },
	{ value: 0.75, label: "75\u00a0%" },
	{ value: 1, label: "Alle" },
] as const;
export const DEFAULT_SHARE = 1;

export const CUT_RATE = 0.03;

export type RiskInput = {
	units: number;
	costPerUnit: number;
	share: number;
	/** Retrofitted with Heidi before the deadline: nothing can be cut. */
	retrofitted: boolean;
};

export function risk({ units, costPerUnit, share, retrofitted }: RiskInput) {
	const base = units * share * costPerUnit;
	return {
		/** Heating costs of the affected units. */
		base,
		/** What tenants may cut per billing period. */
		cut: retrofitted ? 0 : base * CUT_RATE,
		/** The cut per affected unit. */
		perUnit: retrofitted ? 0 : costPerUnit * CUT_RATE,
	};
}

/** Whole numbers with German grouping: 3600 → "3.600". */
export const formatNumber = (n: number) =>
	Math.round(n).toLocaleString("de-DE");
