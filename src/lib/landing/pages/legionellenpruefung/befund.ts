/**
 * The hero card's example lab result (the design's `SET` and `befund()` in
 * #lg-js), pure: the four samples' values per example, the verdict and the
 * bars, plus the schematic's highlighted pipe lengths.
 */
import type { SampleSet } from "./content";

/** Technischer Maßnahmenwert: KBE per 100 ml. */
export const THRESHOLD = 100;

/** KBE per 100 ml at the four sampling points, per example. */
export const SAMPLES: Record<SampleSet, readonly number[]> = {
	ok: [3, 0, 12, 6],
	tmw: [40, 9, 230, 86],
};

/** The example the card starts with (and the server renders). */
export const START_SET: SampleSet = "tmw";

export const isHigh = (value: number) => value >= THRESHOLD;

/** "bad" once any sample reaches the threshold. */
export const verdict = (values: readonly number[]): "ok" | "bad" =>
	values.some(isHigh) ? "bad" : "ok";

/** A value's bar width in percent: 0–200 KBE over the track, capped. */
export const barWidth = (value: number) => Math.min(100, value / 2);

/**
 * The lengths of the four highlighted pipe runs (`.hl`, straight segments in
 * the SVG's units), the design's `getTotalLength()` without measuring.
 */
export const PIPE_LENGTHS = [30, 234, 154, 264];
