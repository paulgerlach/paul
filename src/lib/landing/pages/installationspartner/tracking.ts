/**
 * Row 4's tenant tracking (the design's "Tracking im Haus" in #ipx-js), as
 * data: where the fitter is in the house, which flats are done, and what the
 * tenant of WE 08 sees. Pure, so the server renders the resting step and the
 * steps can be tested.
 */

/** Anchor points of the eight flats in the 300×214 drawing (the design's data-pos). */
export const UNIT_POSITIONS: readonly (readonly [number, number])[] = [
	[104, 183],
	[194, 183],
	[104, 143],
	[194, 143],
	[104, 103],
	[194, 103],
	[104, 63],
	[194, 63],
];

/** The marker sits this far right of a flat's anchor. */
export const MARKER_OFFSET = 20;

/** The marker's position at flat `i`. */
export function markerAt(i: number): [number, number] {
	const [x, y] = UNIT_POSITIONS[i];
	return [x + MARKER_OFFSET, y];
}

export type TrackingStep = {
	/** Time in the pass, ms. */
	at: number;
	/** Flats done: the first `done` ones. */
	done: number;
	/** The flat the fitter is at. */
	current: number;
	/** Flats before the tenant's; `null`: the fitter is at the tenant's. */
	count: number | null;
	/** The fitter is at the tenant's door: the heading and "Bei Ihnen" change. */
	here: boolean;
	/** The progress bar's width, %. */
	bar: number;
	/** The push notification is shown. */
	push: boolean;
};

/** One pass's length, ms. */
export const PASS_MS = 12500;

/** The pass: the fitter moves from WE 05 to WE 08 (the tenant's). */
export const TRACKING_STEPS: readonly TrackingStep[] = [
	{ at: 0, done: 4, current: 4, count: 3, here: false, bar: 33.3, push: false },
	{
		at: 1600,
		done: 5,
		current: 5,
		count: 2,
		here: false,
		bar: 33.3,
		push: true,
	},
	{
		at: 4200,
		done: 5,
		current: 5,
		count: 2,
		here: false,
		bar: 33.3,
		push: false,
	},
	{
		at: 4600,
		done: 6,
		current: 6,
		count: 1,
		here: false,
		bar: 33.3,
		push: false,
	},
	{
		at: 7000,
		done: 7,
		current: 7,
		count: null,
		here: true,
		bar: 66.6,
		push: false,
	},
];

/**
 * The state without motion (the server's, reduced motion's): the design's
 * `RM` branch, two flats to go with the push shown.
 */
export const RESTING_STEP: TrackingStep = TRACKING_STEPS[1];

/** The count's label for `n` flats before the tenant's ("1 Wohnung" / "n Wohnungen"). */
export function countLabel(
	n: number | null,
	texts: { one: string; many: string; here: string },
): string {
	if (n === null) return texts.here;
	return n === 1 ? texts.one : texts.many;
}
