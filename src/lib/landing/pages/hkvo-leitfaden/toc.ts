/**
 * The table of contents' scroll spy (the design's `spy()` in #lf-js), pure:
 * it takes the boxes' viewport positions and the reading line (30 % of the
 * viewport height).
 */

/** The share of the viewport height the reading line sits at. */
export const READING_LINE = 0.3;

/**
 * The index of the last article whose top is above the line; 0 when none
 * is (the first article is marked at the top of the page).
 */
export function activeIndex(tops: number[], line: number): number {
	let current = 0;
	tops.forEach((top, i) => {
		if (top < line) current = i;
	});
	return current;
}

/** How much of the guide's body lies above the line, 0–1. */
export function readProgress(
	bodyTop: number,
	bodyHeight: number,
	line: number,
): number {
	if (bodyHeight <= 0) return 0;
	return Math.max(0, Math.min(1, (line - bodyTop) / bodyHeight));
}
