/**
 * The design's `PG.confetti` (#pg-common): 120 pieces from the centre of an
 * element, on a fixed full-viewport canvas over the page, made on first use
 * and removed when the burst ends or the caller stops it. Nothing with
 * reduced motion (the shared `burst` checks).
 */
import { burst } from "$lib/landing/confetti";
import { prefersReducedMotion } from "$lib/landing/motion";

const MAX_TIME = 4600;

/** Bursts from `origin`'s centre; returns a function that stops it. */
export function confettiFrom(origin: Element): () => void {
	if (prefersReducedMotion()) return () => {};
	const canvas = document.createElement("canvas");
	canvas.setAttribute("aria-hidden", "true");
	canvas.style.cssText =
		"position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:60";
	document.body.append(canvas);

	const o = origin.getBoundingClientRect();
	const stopBurst = burst(
		canvas,
		{ width: window.innerWidth, height: window.innerHeight },
		{ x: o.left + o.width / 2, y: o.top + o.height / 2, width: 0 },
		{
			count: 120,
			speed: [2.6, 4.2],
			angle: 1.2,
			gravity: 0.06,
			maxFall: 1.2,
			wobble: [420, 0.5],
			spin: 0.14,
			fadeAfter: 3400,
			fadeMs: 1000,
			maxTime: MAX_TIME,
		},
	);
	const timer = setTimeout(stop, MAX_TIME + 100);
	function stop() {
		clearTimeout(timer);
		stopBurst();
		canvas.remove();
	}
	return stop;
}
