/**
 * The unit calculator's scale (`#sg-js` "Einheiten-Regler"): a slider from 0
 * to 1000 on a logarithmic scale from 10 to 20.000 units with 1.000 in the
 * middle. Pure, so the server renders the same figure as the browser.
 */

/** The slider's range. */
export const SLIDER_MAX = 1000;
/** From here the large-stock offer shows ("Ab 1.000 Einheiten"). */
export const LARGE_FROM = 1000;
/** The scale's end, shown with a "+". */
export const UNITS_MAX = 20000;

/** Slider value (0–1000) → units, rounded as the design rounds them. */
export function toUnits(value: number): number {
	const t = value / SLIDER_MAX;
	const u =
		t <= 0.5
			? 10 * 100 ** (t / 0.5)
			: LARGE_FROM * (UNITS_MAX / LARGE_FROM) ** ((t - 0.5) / 0.5);
	if (u >= 1000) return Math.round(u / 100) * 100;
	if (u >= 100) return Math.round(u / 10) * 10;
	return Math.round(u);
}

/** Units → the nearest slider value. */
export function toValue(units: number): number {
	const half = SLIDER_MAX / 2;
	const v =
		units <= LARGE_FROM
			? (Math.log(units / 10) / Math.log(100)) * half
			: half +
				(Math.log(units / LARGE_FROM) / Math.log(UNITS_MAX / LARGE_FROM)) *
					half;
	return Math.min(SLIDER_MAX, Math.max(0, Math.round(v)));
}

export const isLarge = (units: number) => units >= LARGE_FROM;

/** German thousands, with "+" at the scale's end ("20.000+"). */
export function formatUnits(units: number): string {
	return units.toLocaleString("de-DE") + (units >= UNITS_MAX ? "+" : "");
}
