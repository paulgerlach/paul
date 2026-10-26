/**
 * The page's animations as data: the design's timelines (#ip-js, #ip-orb-js,
 * #iq-js) as step lists and the curve math the packets move along. Pure, so
 * the components only schedule and render.
 */

export type Point = { x: number; y: number };

/** A cubic Bézier: start, two controls, end. */
export type Cubic = [Point, Point, Point, Point];

/** The point on a cubic Bézier at parameter `t` (0–1). */
export function cubicPoint([p0, c1, c2, p1]: Cubic, t: number): Point {
	const u = 1 - t;
	const a = u * u * u;
	const b = 3 * u * u * t;
	const c = 3 * u * t * t;
	const d = t * t * t;
	return {
		x: a * p0.x + b * c1.x + c * c2.x + d * p1.x,
		y: a * p0.y + b * c1.y + c * c2.y + d * p1.y,
	};
}

/**
 * The point at share `s` (0–1) of the curve's length (the design's
 * `getPointAtLength`), from a table of `n` chords.
 */
export function pointAtShare(curve: Cubic, s: number, n = 32): Point {
	const lengths = [0];
	let prev = curve[0];
	for (let i = 1; i <= n; i++) {
		const pt = cubicPoint(curve, i / n);
		lengths.push(lengths[i - 1] + Math.hypot(pt.x - prev.x, pt.y - prev.y));
		prev = pt;
	}
	const target = Math.min(1, Math.max(0, s)) * lengths[n];
	let i = 1;
	while (i < n && lengths[i] < target) i++;
	const span = lengths[i] - lengths[i - 1];
	const k = span > 0 ? (target - lengths[i - 1]) / span : 0;
	return cubicPoint(curve, (i - 1 + k) / n);
}

/** The curve as an SVG path. */
export const cubicPath = ([p0, c1, c2, p1]: Cubic) =>
	`M${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p1.x} ${p1.y}`;

/** The designs' ease-in-out (quadratic). */
export const ease = (p: number) =>
	p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;

/** A box relative to the hub (the design's `rel()`). */
export type Box = { l: number; t: number; r: number; b: number };

/**
 * A wire from a device to the dashboard (the design's `layout()`): side by
 * side, from the device's right edge to the left edge of its group's row;
 * stacked (below 900 px), from the device's bottom to the dashboard's top,
 * the four ends spread over its width.
 */
export function wire(
	device: Box,
	target: Box,
	dashboard: Box,
	stacked: boolean,
	i: number,
): Cubic {
	if (!stacked) {
		const x0 = device.r;
		const y0 = (device.t + device.b) / 2;
		const x1 = dashboard.l;
		const y1 = (target.t + target.b) / 2;
		const m = (x1 - x0) * 0.5;
		return [
			{ x: x0, y: y0 },
			{ x: x0 + m, y: y0 },
			{ x: x1 - m, y: y1 },
			{ x: x1, y: y1 },
		];
	}
	const x0 = (device.l + device.r) / 2;
	const y0 = device.b;
	const x1 = dashboard.l + (dashboard.r - dashboard.l) * (0.15 + (0.7 * i) / 3);
	const y1 = dashboard.t;
	const m = (y1 - y0) * 0.6;
	return [
		{ x: x0, y: y0 },
		{ x: x0, y: y0 + m },
		{ x: x1, y: y1 - m },
		{ x: x1, y: y1 },
	];
}

/** One packet's reading for a group of `total` devices: a fifth, rounded up. */
export const addReading = (count: number, total: number) =>
	Math.min(total, count + Math.ceil(total / 5));

/** The hero's hub: a packet every 450 ms, a rotation after every fifth. */
export const HUB = {
	/** Wait before the first packet. */
	start: 600,
	/** A packet's flight. */
	flight: 1000,
	/** Between packets. */
	gap: 450,
	/** After every fifth packet the devices move up one row. */
	rotateEvery: 5,
	/** The wait after a fifth packet (it rotates 1050 ms in). */
	rotateGap: 2100,
	rotateAt: 1050,
	/** The rotation's slide. */
	slide: 820,
	/** Full dashboard: hold, then start again from 0. */
	hold: 2600,
	restart: 600,
	/** A device's and a row's highlight. */
	flash: 600,
} as const;

/** Row 1's decoder: five rows come in and decode, then a pause. */
export const DECODER = {
	first: 400,
	/** Between rows. */
	row: 1100,
	/** Hex flicker steps after a row comes in. */
	flicker: 110,
	flickers: 5,
	/** A row decodes this long after coming in. */
	decode: 700,
	/** The done line, after the last row. */
	doneAfter: 300,
	/** One pass: five rows and the pause (the design's rerun at +4200). */
	every: 400 + 5 * 1100 + 4200,
};

/** A random radio telegram: 14 hex bytes (the design's `hex()`). */
export function telegram(random: () => number = Math.random) {
	const HEX = "0123456789ABCDEF";
	let s = "";
	for (let i = 0; i < 14; i++)
		s += `${HEX[(random() * 16) | 0]}${HEX[(random() * 16) | 0]} `;
	return s.trimEnd();
}

/** Row 3's check: three items run and tick, then the next group. */
export const CHECK = {
	first: 300,
	/** Between items. */
	item: 900,
	/** An item ticks this long after it starts. */
	tick: 750,
	/** The result line, after the last item. */
	doneAfter: 150,
	/** One group's pass (the design's next group at +2600). */
	every: 300 + 3 * 900 + 2600,
};

/** The orb: a pulse every 1.6 s, out to a system and, every other round, back in. */
export const ORB = {
	every: 1600,
	flight: 1000,
	/** The spoke and the system stay lit this long after the dot arrives. */
	linger: 500,
	/** The spokes' end, in the 400 × 400 box (the systems sit at 36 % from the centre). */
	radius: 144,
};

/** The spoke `i` of `n`, clockwise from the top, in the orb's 400 × 400 box. */
export function spoke(i: number, n: number): Point {
	const a = (i / n) * 2 * Math.PI;
	return {
		x: Math.round((200 + ORB.radius * Math.sin(a)) * 10) / 10,
		y: Math.round((200 - ORB.radius * Math.cos(a)) * 10) / 10,
	};
}

/** Pulse `k`'s system and direction: outward for a full round, then inward. */
export const pulse = (k: number, n: number) => ({
	system: k % n,
	out: Math.floor(k / n) % 2 === 0,
});

/** Card 1: five devices read one by one, then a pause. */
export const READING = {
	first: 700,
	/** Reading one device. */
	read: 820,
	/** After a device's value. */
	after: 160,
	/** The value counts up. */
	count: 520,
	hold: 3200,
	every: 700 + 5 * (820 + 160) + 3200,
};

/** When device `i` starts and ends reading in card 1's pass. */
export const readingAt = (i: number) => {
	const start = READING.first + i * (READING.read + READING.after);
	return { start, done: start + READING.read };
};

/**
 * Card 2's packets: round robin over the sources until each has sent its
 * total in steps of `step` (the design's `seq`).
 */
export function mergeSequence(
	sources: { key: string; total: number }[],
	step: number,
): string[] {
	const left = sources.map((s) => s.total / step);
	const seq: string[] = [];
	while (left.some((n) => n > 0))
		sources.forEach((s, i) => {
			if (left[i] > 0) {
				seq.push(s.key);
				left[i]--;
			}
		});
	return seq;
}

/** Card 2: the packets' timing. */
export const MERGE = {
	first: 500,
	flight: 1050,
	/** Between packets; after the last source's, shorter. */
	gap: 330,
	gapLast: 260,
	hold: 4200,
};

/** The send times of card 2's packets, and the pass's length. */
export function mergeTimes(seq: string[], last: string) {
	const at: number[] = [];
	let t = MERGE.first;
	for (const key of seq) {
		at.push(t);
		t += key === last ? MERGE.gapLast : MERGE.gap;
	}
	return { at, every: t + MERGE.hold };
}

/** Card 2's curves, in the diagram's 470 × 224 box. */
export const MERGE_CURVES: Cubic[] = [44, 112, 180].map((y) => [
	{ x: 152, y },
	{ x: 214, y },
	{ x: 220, y: 112 },
	{ x: 280, y: 112 },
]);

/** Card 3: the scan line ticks the clauses, then the devices connect and the stamp lands. */
export const LAW = {
	first: 700,
	/** The scan line shows, then moves to each clause. */
	show: 50,
	move: 650,
	tick: 420,
	connectHold: 1300,
	stampHold: 3600,
};

/** Card 3's pass: when the scan line reaches and ticks clause `i`, and the rest. */
export function lawTimes(clauses: number) {
	const per = LAW.move + LAW.tick;
	const scan = LAW.first;
	const reach = (i: number) => scan + LAW.show + i * per;
	const tick = (i: number) => reach(i) + LAW.move;
	const connect = reach(clauses);
	const stamp = connect + LAW.connectHold;
	return { scan, reach, tick, connect, stamp, every: stamp + LAW.stampHold };
}

/** Card 4: each service's key flies to the owner, then the stack folds into Heidi. */
export const KEYS = {
	first: 800,
	/** A service is highlighted, then its key flies. */
	highlight: 420,
	flight: 900,
	after: 260,
	stackAfter: 700,
	mergeAfter: 850,
	hold: 3600,
	fade: 450,
	reset: 500,
};

/** Card 4's pass. */
export function keysTimes(services: number) {
	const per = KEYS.highlight + KEYS.flight + KEYS.after;
	const highlight = (i: number) => KEYS.first + i * per;
	const fly = (i: number) => highlight(i) + KEYS.highlight;
	const land = (i: number) => fly(i) + KEYS.flight;
	const stack = KEYS.first + services * per + KEYS.stackAfter;
	const merge = stack + KEYS.mergeAfter;
	const fade = merge + KEYS.hold;
	const reset = fade + KEYS.fade;
	return {
		highlight,
		fly,
		land,
		stack,
		merge,
		fade,
		reset,
		every: reset + KEYS.reset,
	};
}
