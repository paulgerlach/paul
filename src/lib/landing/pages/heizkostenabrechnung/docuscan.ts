/**
 * The DocuScan demo's form rules (the design's `#hk-js`): amounts in German
 * notation, the invoice date, and when a field is valid. Pure.
 */

/**
 * An amount as typed: "4.371,89", "4371.89", "1.234" or "12 €". The design's
 * `pnum`: with a comma, dots are thousands; without one, only a dot followed
 * by groups of three is. NaN for an empty or unreadable value.
 */
export function parseAmount(value: string): number {
	let v = value.replace(/[€\s]/g, "");
	if (!v) return NaN;
	if (v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
	else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, "");
	return parseFloat(v);
}

/** "4.371,89" */
export const formatAmount = (n: number) =>
	n.toLocaleString("de-DE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

/** A real calendar date as tt.mm.jjjj (single-digit day and month allowed). */
export function isDate(value: string): boolean {
	const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value.trim());
	if (!m) return false;
	const [day, month, year] = [+m[1], +m[2], +m[3]];
	const d = new Date(Date.UTC(year, month - 1, day));
	return d.getUTCDate() === day && d.getUTCMonth() === month - 1;
}

export const isAmount = (value: string) => parseAmount(value) > 0;

/** The amount for a card's head: "4.371,89 €", or "– €" while unreadable. */
export function amountLabel(value: string): string {
	const n = parseAmount(value);
	return Number.isNaN(n) ? "– €" : `${formatAmount(n)} €`;
}

/** The scan's timeline in ms (the design's `run`). */
export const SCAN = {
	/** The ring fills over this. */
	duration: 5200,
	/** Step i starts at `stepAt + i * stepEvery`. */
	stepAt: 300,
	stepEvery: 1250,
	/** A lit invoice field turns to "read" after this. */
	hitFor: 1100,
	done: 5300,
	fadeOut: 5900,
	result: 6250,
	/** Card i comes in at `cardAt + i * cardEvery` after the result. */
	cardAt: 80,
	cardEvery: 220,
	/** The open card's field i starts typing at `typeAt + i * typeEvery`. */
	typeAt: 400,
	typeEvery: 350,
	/** Per character. */
	typeStep: 45,
};
