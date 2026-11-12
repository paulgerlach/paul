/**
 * The hero's heat map (the design's #ha-js), pure: the example building
 * before and after the balancing, the room colours and the figures.
 * Floors are listed top (4. OG) to bottom (EG).
 */

export type HeatState = {
	/** Room temperature per floor, °C. */
	temps: number[];
	/** Flow per floor: the dashes' speed (Web Animations playback rate). */
	flows: number[];
	/** Flow temperature, °C. */
	flowTemp: number;
	/** Pump stage. */
	pump: number;
};

export const BEFORE: HeatState = {
	temps: [17.6, 18.4, 20.1, 22.6, 24.2],
	flows: [0.35, 0.55, 0.85, 1.35, 1.8],
	flowTemp: 70,
	pump: 3,
};

export const AFTER: HeatState = {
	temps: [20.9, 21.0, 21.1, 21.0, 20.9],
	flows: [0.85, 0.8, 0.75, 0.8, 0.9],
	flowTemp: 55,
	pump: 2,
};

/** The heat load per floor, kW (shown during the first phase). */
export const LOADS = ["1,4", "1,2", "1,1", "1,2", "1,5"];

/** The valves' presetting per floor. */
export const PRESETS = [6, 5, 4, 4, 3];

/** The top of each floor's room in the SVG; each is 42 high. */
export const FLOOR_TOPS = [46, 90, 134, 178, 222];

const STOPS: [number, [number, number, number]][] = [
	[17, [111, 168, 214]],
	[21, [138, 214, 143]],
	[24.5, [232, 135, 90]],
];

/** The room colour for a temperature: blue (cold) → green → orange (warm). */
export function color(t: number): string {
	if (t <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(",")})`;
	for (let k = 1; k < STOPS.length; k++) {
		const [t1, c1] = STOPS[k];
		if (t <= t1) {
			const [t0, c0] = STOPS[k - 1];
			const f = (t - t0) / (t1 - t0);
			return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * f)).join(",")})`;
		}
	}
	return `rgb(${STOPS[2][1].join(",")})`;
}

/** The spread between the warmest and the coldest floor, K. */
export const spread = (temps: number[]): number =>
	Math.max(...temps) - Math.min(...temps);

/** A temperature's label class: below 19 cold, above 23 hot. */
export const tone = (t: number): "cold" | "hot" | "" =>
	t < 19 ? "cold" : t > 23 ? "hot" : "";

/** The dashes' opacity for a flow. */
export const flowOpacity = (f: number): number => Math.min(1, 0.35 + f * 0.4);

/** "20,9": German, one decimal. */
export const de1 = (n: number): string =>
	n.toLocaleString("de-DE", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	});
