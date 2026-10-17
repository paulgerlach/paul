/**
 * Confetti burst on a canvas, ported from the city designs (both billing
 * demos use the same one): 60 pieces in 6 colours, falling for about 3.8 s,
 * then the canvas is cleared. The options default to that burst; /upgrade-now
 * passes its slower one. No dependency. Does nothing with reduced motion.
 * Returns a function that stops it (for teardown).
 */
import { prefersReducedMotion } from "./motion";

const COLORS = [
	"#8AD68F",
	"#1E322D",
	"#6282D0",
	"#F2C14E",
	"#D9622B",
	"#CFE9D1",
];

type Options = {
	/** Launch speed range (the dark section's burst is a bit stronger). */
	speed?: [min: number, spread: number];
	/** Piece size: width [min, spread] and height [min, spread]. */
	size?: { w: [number, number]; h: [number, number] };
	/** Horizontal spread of the launch point, as a share of `origin.width`. */
	spread?: number;
	count?: number;
	colors?: string[];
	/** Launch angle range around straight up, as a share of π. */
	angle?: number;
	/** Added to the fall speed per frame. */
	gravity?: number;
	/** Maximum fall speed. */
	maxFall?: number;
	/** Fade-out start and length, ms. */
	fadeAfter?: number;
	fadeMs?: number;
	/** The burst ends after this many ms at the latest. */
	maxTime?: number;
	/** Sideways wobble: period (ms) and amplitude. */
	wobble?: [period: number, amplitude: number];
	/** Spin speed range. */
	spin?: number;
};

/**
 * @param canvas sized to `width`×`height` CSS px by this function
 * @param origin launch point and width of the button, in canvas px
 */
export function burst(
	canvas: HTMLCanvasElement,
	{ width, height }: { width: number; height: number },
	origin: { x: number; y: number; width: number },
	{
		speed = [2.6, 3.6],
		size = { w: [5, 5], h: [7, 7] },
		spread = 0.7,
		count = 60,
		colors = COLORS,
		angle = 1.1,
		gravity = 0.085,
		maxFall = 1.6,
		fadeAfter = 2800,
		fadeMs = 900,
		maxTime = 3800,
		wobble = [380, 0.45],
		spin = 0.16,
	}: Options = {},
): () => void {
	const ctx = canvas.getContext("2d");
	if (!ctx || prefersReducedMotion()) return () => {};

	const dpr = window.devicePixelRatio || 1;
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	const pieces = Array.from({ length: count }, (_, i) => {
		const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * angle;
		const v = speed[0] + Math.random() * speed[1];
		return {
			x: origin.x + (Math.random() - 0.5) * origin.width * spread,
			y: origin.y,
			vx: Math.cos(a) * v,
			vy: Math.sin(a) * v,
			w: size.w[0] + Math.random() * size.w[1],
			h: size.h[0] + Math.random() * size.h[1],
			r: Math.random() * 6.28,
			vr: (Math.random() - 0.5) * spin,
			ph: Math.random() * 6.28,
			c: colors[i % colors.length],
			round: Math.random() < 0.25,
		};
	});

	const t0 = performance.now();
	let last = t0;
	let frame = requestAnimationFrame(function tick(now) {
		const t = now - t0;
		const k = Math.min(2, (now - last) / 16.67);
		last = now;
		ctx.clearRect(0, 0, width, height);
		const fade = Math.max(0, 1 - Math.max(0, t - fadeAfter) / fadeMs);
		let alive = 0;
		for (const p of pieces) {
			p.vy += gravity * k;
			p.vx *= 0.975 ** k;
			p.vy *= 0.975 ** k;
			if (p.vy > maxFall) p.vy = maxFall;
			p.x += (p.vx + Math.sin(t / wobble[0] + p.ph) * wobble[1]) * k;
			p.y += p.vy * k;
			p.r += p.vr * k;
			if (fade <= 0 || p.y > height + 20) continue;
			alive++;
			ctx.save();
			ctx.globalAlpha = fade;
			ctx.translate(p.x, p.y);
			ctx.rotate(p.r);
			ctx.fillStyle = p.c;
			if (p.round) {
				ctx.beginPath();
				ctx.arc(0, 0, p.w / 2, 0, 6.28);
				ctx.fill();
			} else {
				ctx.fillRect(
					-p.w / 2,
					-p.h / 2,
					p.w,
					p.h * Math.abs(Math.cos(p.r * 1.3)) + 1,
				);
			}
			ctx.restore();
		}
		if (alive && t < maxTime) frame = requestAnimationFrame(tick);
		else ctx.clearRect(0, 0, width, height);
	});

	return () => {
		cancelAnimationFrame(frame);
		ctx.clearRect(0, 0, width, height);
	};
}
