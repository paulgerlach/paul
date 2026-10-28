/** True if the visitor asked for reduced motion. Browser-only. */
export const prefersReducedMotion = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Tweens a number from `from` to `to` with an ease-out cubic curve, calling
 * `onFrame` with each value. Instant with reduced motion. Returns a cancel
 * function.
 */
export function tweenNumber(
	from: number,
	to: number,
	ms: number,
	onFrame: (value: number) => void,
): () => void {
	if (prefersReducedMotion() || from === to) {
		onFrame(to);
		return () => {};
	}
	const t0 = performance.now();
	let frame = requestAnimationFrame(function tick(now) {
		const k = Math.min(1, (now - t0) / ms);
		onFrame(from + (to - from) * (1 - (1 - k) ** 3));
		if (k < 1) frame = requestAnimationFrame(tick);
	});
	return () => cancelAnimationFrame(frame);
}
