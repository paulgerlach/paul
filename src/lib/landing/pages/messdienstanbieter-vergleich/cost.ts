/**
 * Step 2's calculator, pure (the design's `num()`, `cost()` and `de()`):
 * the cost per flat and year from the device rents and the reading and
 * billing fee, the whole stock per year and over six years.
 */
import type { CostKey } from "./content";

/** A field as the design reads it: a comma is the decimal point; anything not finite or negative counts as 0. */
export function parseField(text: string): number {
	const value = parseFloat(String(text).replace(",", "."));
	return Number.isFinite(value) && value >= 0 ? value : 0;
}

export type CostInput = Record<CostKey, number>;

export function costs({ we, hkv, wz, phkv, pwz, pabr }: CostInput) {
	const allocators = hkv * phkv;
	const water = wz * pwz;
	const billing = pabr;
	const perFlat = allocators + water + billing;
	const perYear = perFlat * we;
	const share = (x: number) => (perFlat ? (x / perFlat) * 100 : 0);
	return {
		allocators,
		water,
		billing,
		perFlat,
		perYear,
		sixYears: perYear * 6,
		/** The stack's three parts in % of the flat's cost. */
		shares: [share(allocators), share(water), share(billing)] as const,
	};
}

/** German number with fixed digits (the design's `de()`). */
export const formatDe = (n: number, digits = 0) =>
	Number(n).toLocaleString("de-DE", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	});

export const euro = (n: number, digits = 0) => `${formatDe(n, digits)} €`;
