/**
 * Confetti burst on a canvas, ported from the city designs (both billing
 * demos use the same one): 60 pieces in 6 colours, falling for about 3.8 s,
 * then the canvas is cleared. No dependency. Does nothing with reduced
 * motion. Returns a function that stops it (for teardown).
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
	}: Options = {},
): () => void {
	const ctx = canvas.getContext("2d");
	if (!ctx || prefersReducedMotion()) return () => {};

	const dpr = window.devicePixelRatio || 1;
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	const pieces = Array.from({ length: 60 }, (_, i) => {
		const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
		const v = speed[0] + Math.random() * speed[1];
		return {
			x: origin.x + (Math.random() - 0.5) * origin.width * spread,
			y: origin.y,
			vx: Math.cos(a) * v,
			vy: Math.sin(a) * v,
			w: size.w[0] + Math.random() * size.w[1],
			h: size.h[0] + Math.random() * size.h[1],
			r: Math.random() * 6.28,
			vr: (Math.random() - 0.5) * 0.16,
			ph: Math.random() * 6.28,
			c: COLORS[i % COLORS.length],
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
		const fade = Math.max(0, 1 - Math.max(0, t - 2800) / 900);
		let alive = 0;
		for (const p of pieces) {
			p.vy += 0.085 * k;
			p.vx *= 0.975 ** k;
			p.vy *= 0.975 ** k;
			if (p.vy > 1.6) p.vy = 1.6;
			p.x += (p.vx + Math.sin(t / 380 + p.ph) * 0.45) * k;
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
		if (alive && t < 3800) frame = requestAnimationFrame(tick);
		else ctx.clearRect(0, 0, width, height);
	});

	return () => {
		cancelAnimationFrame(frame);
		ctx.clearRect(0, 0, width, height);
	};
}
