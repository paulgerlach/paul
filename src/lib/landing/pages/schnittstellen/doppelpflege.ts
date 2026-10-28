/**
 * The Doppelpflege-Rechner (plan 01 §1.3): the time and internal cost of
 * moving data from the provider's portal into the customer's software by
 * hand, from the visitor's own assumptions. Pure, shared by the server
 * render and the browser; rounding of the hours and days happens only when
 * formatting, the cost is rounded to 10 € as in the design.
 */

export type Inputs = {
	/** Liegenschaften */
	l: number;
	/** Übertragungen je Liegenschaft und Jahr */
	u: number;
	/** Minuten je Übertragung */
	m: number;
	/** Interner Stundensatz in € */
	s: number;
};

export type Result = {
	hours: number;
	/** Working days of 8 hours. */
	days: number;
	/** Internal cost in €, rounded to 10 €. */
	cost: number;
	/** Lit cells of the day grid: one per working day, at most `cells`. */
	lit: number;
};

/** The cost rounded to 10 €, as the design shows it (also on every tween frame). */
export const roundCost = (euros: number) => Math.round(euros / 10) * 10;

export function doppelpflege({ l, u, m, s }: Inputs, cells = 60): Result {
	const hours = (l * u * m) / 60;
	return {
		hours,
		days: hours / 8,
		cost: roundCost(hours * s),
		lit: Math.min(cells, Math.round(hours / 8)),
	};
}
