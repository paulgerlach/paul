/**
 * The scroll scene's and the flow's math (`#pv-js`), pure so it can be
 * tested: what the scene shows for a scroll progress, and where its layers
 * sit so the photo always covers the frame.
 */

export const clamp = (x: number, a: number, b: number) =>
	Math.max(a, Math.min(b, x));

/** Where `p` is between `a` and `b`, 0–1. */
export const seg = (p: number, a: number, b: number) =>
	clamp((p - a) / (b - a), 0, 1);

/** Ease in and out (quadratic). */
export const ease = (t: number) =>
	t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

/** The progress through a tall section: 0 at its top, 1 at its end. */
export function progress(top: number, height: number, viewport: number) {
	const total = height - viewport;
	return total > 0 ? clamp(-top / total, 0, 1) : 1;
}

/** The thresholds of the tags, in order. */
export const TAGS_FROM = [0.74, 0.8, 0.86];

export type SceneState = {
	/** The frame's width (%) and corner radius (px). */
	frameWidth: number;
	frameRadius: number;
	/** The flat: its zoom progress (0–1), scale, blur (px) and opacity. */
	roomZoom: number;
	roomScale: number;
	roomBlur: number;
	roomOpacity: number;
	/** The cabinet with the meters: opacity, scale and blur. */
	meterOpacity: number;
	meterScale: number;
	meterBlur: number;
	/** The caption shown (0–2). */
	caption: number;
	/** The signal points shown. */
	signals: boolean;
	/** How many tags are shown (0–3). */
	tags: number;
};

/** The scene for the progress `p` (the design's `scene()`). */
export function sceneState(p: number): SceneState {
	const a = ease(seg(p, 0, 0.14));
	const z = ease(seg(p, 0.04, 0.56));
	const x = seg(p, 0.44, 0.6);
	const mz = ease(seg(p, 0.44, 1));
	return {
		frameWidth: 88 + 12 * a,
		frameRadius: 28 - 12 * a,
		roomZoom: z,
		roomScale: 1 + 1.35 * z,
		roomBlur: x * 7,
		roomOpacity: 1 - seg(p, 0.5, 0.62),
		meterOpacity: x,
		meterScale: 1.28 + 0.42 * mz,
		meterBlur: (1 - x) * 8,
		caption: p < 0.33 ? 0 : p < 0.62 ? 1 : 2,
		signals: p > 0.68,
		tags: TAGS_FROM.filter((t) => p > t).length,
	};
}

/**
 * A layer's box: `left` and `width` of the 3:2 photo (it covers the frame),
 * and the frame's width, px.
 */
export type Layer = { left: number; width: number; frame: number };

/**
 * The horizontal shift (px) that brings the photo's point `fx` (0–1 of its
 * width) into the middle part of the frame (30–66 %), or 0 if it's there
 * (the design's `dxFor`).
 */
export function aimX({ left, width, frame }: Layer, fx: number) {
	const fp = left + fx * width;
	const lo = frame * 0.3;
	const hi = frame * 0.66;
	return fp > hi ? hi - fp : fp < lo ? lo - fp : 0;
}

/**
 * The shift closest to `tx` that keeps the layer, scaled by `s` around its
 * point `origin` (0–1 of its width), covering the frame (the design's `cov`).
 */
export function coverX(
	{ left, width, frame }: Layer,
	origin: number,
	s: number,
	tx: number,
) {
	const ox = left + origin * width;
	const lo = frame - (ox + (left + width - ox) * s);
	const hi = -(ox + (left - ox) * s);
	return lo > hi ? (lo + hi) / 2 : clamp(tx, lo, hi);
}

/** The flow's step (0–`steps − 1`) and its line's fill (0–1) for `p`. */
export function flowStep(p: number, steps = 5) {
	const f = clamp(p, 0, 0.9999) * steps;
	const step = Math.floor(f);
	return { step, fill: f - step };
}
