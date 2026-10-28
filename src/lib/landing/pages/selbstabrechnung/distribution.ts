/**
 * The calculator's heating cost split after § 7 HeizkostenV, simplified as in
 * the design: a share of the costs by consumption (50–70 %), the rest by
 * floor area. Pure, shared by the server render and the browser; rounding
 * happens only when formatting.
 */

export type Flat = { id: string; area: number; units: number };

export type Range = { min: number; max: number; step: number };

export type FlatCosts = Flat & {
	base: number;
	consumption: number;
	total: number;
};

export type Distribution = {
	/** Grundkosten, by floor area. */
	base: number;
	/** Verbrauchskosten, by consumption. */
	consumption: number;
	perM2: number;
	perUnit: number;
	rows: FlatCosts[];
	/** The largest row total; the bars scale to it. */
	max: number;
	totalArea: number;
	totalUnits: number;
};

/** A slider value on its range and step (the browser does the same). */
export function clampStep(value: number, { min, max, step }: Range): number {
	if (!Number.isFinite(value)) return min;
	const stepped = min + Math.round((value - min) / step) * step;
	return Math.min(max, Math.max(min, stepped));
}

export function distribute({
	costs,
	sharePercent,
	flats,
}: {
	costs: number;
	sharePercent: number;
	flats: Flat[];
}): Distribution {
	const share = sharePercent / 100;
	const totalArea = flats.reduce((sum, f) => sum + f.area, 0);
	const totalUnits = flats.reduce((sum, f) => sum + f.units, 0);
	const base = costs * (1 - share);
	const consumption = costs * share;
	const perM2 = totalArea ? base / totalArea : 0;
	const perUnit = totalUnits ? consumption / totalUnits : 0;
	const rows = flats.map((flat) => {
		const b = flat.area * perM2;
		const c = flat.units * perUnit;
		return { ...flat, base: b, consumption: c, total: b + c };
	});
	return {
		base,
		consumption,
		perM2,
		perUnit,
		rows,
		max: Math.max(0, ...rows.map((r) => r.total)),
		totalArea,
		totalUnits,
	};
}
