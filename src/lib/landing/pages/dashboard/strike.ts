/**
 * The scroll scene "Was Ihnen das Dashboard abnimmt": where each line is for a
 * given scroll progress, as the design computes it (plan 03, 3B.3). Pure.
 */

export type StrikeFrame = {
	opacity: number;
	/** Vertical offset from the centre, px. */
	y: number;
	blur: number;
	scale: number;
	/** Width of the strike-through, 0–1. */
	strike: number;
	/** Struck and leaving: drawn in the faint colour. */
	faded: boolean;
};

const clamp = (x: number) => Math.max(0, Math.min(1, x));

/** Scroll progress 0–1 through the section → the scene's time, 0 … ~n. */
export function strikeTime(progress: number, lines: number): number {
	return clamp(progress) * (lines - 1) * 1.08;
}

/** The index of the current line (the active dot). */
export function currentLine(t: number, lines: number): number {
	return Math.min(lines - 1, Math.floor(t + 0.1));
}

/**
 * Line `i` of `n` at time `t`. `height` is the line's own height and
 * `prevHeight` the one before it (for the travel distances).
 */
export function strikeFrame(
	i: number,
	t: number,
	n: number,
	height: number,
	prevHeight: number,
): StrikeFrame {
	const d = t - i;
	const last = i === n - 1;
	const out = Math.max(78, height + 22);
	const into = Math.max(60, (prevHeight + height) / 2 + 18);
	let f: StrikeFrame;
	if (d < -0.25) {
		f = { opacity: 0, y: into, blur: 0, scale: 1, strike: 0, faded: false };
	} else if (d < 0) {
		const k = clamp((d + 0.25) / 0.25);
		f = {
			opacity: k,
			y: (1 - k) * into,
			blur: (1 - k) * 4,
			scale: 1,
			strike: 0,
			faded: false,
		};
	} else if (last || d < 0.75) {
		f = {
			opacity: 1,
			y: 0,
			blur: 0,
			scale: 1,
			strike: last ? 0 : clamp((d - 0.3) / 0.35),
			faded: false,
		};
	} else {
		const k = clamp((d - 0.75) / 0.25);
		f = {
			opacity: 1 - k * 0.62,
			y: -k * out,
			blur: k * 3.5,
			scale: 1 - k * 0.06,
			strike: 1,
			faded: true,
		};
		if (d > 1.75) {
			const k3 = clamp((d - 1.75) / 0.25);
			f.opacity = 0.38 * (1 - k3);
			f.y = -out - k3 * 40;
		}
	}
	return f;
}
