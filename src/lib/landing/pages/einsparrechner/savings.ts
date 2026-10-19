/**
 * The Einsparrechner's math (the design's `calc()` in #es-js), pure: the
 * working time Heidi takes over and the cut tenants could make (3 % of the
 * heating and hot-water costs per missing duty, § 12 HeizkostenV), per year.
 */
import {
	CUT_RATE,
	formatDecimal,
	formatNumber,
} from "$lib/landing/pages/upgrade-now/calculator";
import type { FieldId } from "./content";

export type Inputs = Record<FieldId, number>;

export type Savings = {
	/** Hours per year: the three tasks × Liegenschaften. */
	hours: number;
	/** Those hours at the team's rate, €. */
	time: number;
	/** The avoided cut, €. */
	risk: number;
	/** Heating costs of every unit, € (the cut's base). */
	riskBase: number;
	total: number;
	/** Working days of 8 hours. */
	days: number;
	/** The total per unit, € (0 without units). */
	perUnit: number;
	/** The bars' widths in percent, relative to the larger figure. */
	bars: { time: number; risk: number };
};

/** `risks`: how many of the two toggles are on. */
export function savings(v: Inputs, risks: number): Savings {
	const hours = (v.a1 + v.a2 + v.a3) * v.lg;
	const time = hours * v.ss;
	const riskBase = v.we * v.hk;
	const risk = riskBase * CUT_RATE * risks;
	const total = time + risk;
	// The design's floor of 1 €, so nothing divides by zero.
	const max = Math.max(time, risk, 1);
	return {
		hours,
		time,
		risk,
		riskBase,
		total,
		days: hours / 8,
		perUnit: v.we ? total / v.we : 0,
		bars: { time: (time / max) * 100, risk: (risk / max) * 100 },
	};
}

const NB = " ";

/** The design's `de(n, n % 1 ? 1 : 0)`: "4", "4,5", "1.000". */
export const formatValue = (n: number) =>
	n % 1 ? formatDecimal(n, 1) : formatNumber(n);

/** A whole-euro figure: "7.020 €". */
export const euros = (n: number) => `${formatNumber(n)}${NB}€`;

/** "156 Stunden pro Jahr" */
export const hoursText = (hours: number, label: string) =>
	`${formatValue(hours)}${NB}${label}`;

/** "2 × 3 % Kürzungsrecht auf 240.000 € Heizkosten", or `none`. */
export function riskText(
	count: number,
	base: number,
	line: { cut: string; base: string },
	none: string,
) {
	if (!count) return none;
	return `${count}${NB}${line.cut.replace("3 %", `3${NB}%`)} ${formatNumber(base)}${NB}${line.base}`;
}
