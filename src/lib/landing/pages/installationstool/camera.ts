/**
 * Row 2's camera loop as data: the design's timeline of class sets
 * (`s2` / `s3`, `fx`, `fl`, `t1` / `t2`) as states. Pure, so the component
 * only schedules them.
 */

export type CameraState = {
	/** 1: the old meter, 2: the new meter, 3: done (the new meter and the done line). */
	photo: 1 | 2 | 3;
	/** The viewfinder's corners focus (`fx`). */
	focus: boolean;
	/** The flash fires and the shutter is pressed (`fl`). */
	flash: boolean;
	/** Thumbnails taken so far (`t1`, `t2`). */
	thumbs: 0 | 1 | 2;
};

const state = (
	photo: CameraState["photo"],
	thumbs: CameraState["thumbs"],
	focus = false,
	flash = false,
): CameraState => ({ photo, focus, flash, thumbs });

/** The empty state a pass starts from (the design's `set('')`). */
export const CAMERA_START = state(1, 0);

/** The finished state: the server's, the reduced-motion one and every pass's last. */
export const CAMERA_END = state(3, 2);

/** One pass, in ms from its start (the design's `at(…)` calls). */
export const CAMERA_STEPS: { at: number; state: CameraState }[] = [
	{ at: 700, state: state(1, 0, true) },
	{ at: 1500, state: state(1, 1, true, true) },
	{ at: 2100, state: state(1, 1) },
	{ at: 2600, state: state(2, 1) },
	{ at: 3300, state: state(2, 1, true) },
	{ at: 4100, state: state(2, 2, true, true) },
	{ at: 4700, state: CAMERA_END },
];

/** A pass every 9.5 s, as the design's `at(9500, run)`. */
export const CAMERA_EVERY = 9500;
