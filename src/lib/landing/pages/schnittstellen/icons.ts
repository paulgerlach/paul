/**
 * The design's 20×20 line icons on /plattform/schnittstellen, as shapes drawn by
 * `components/Icon.svelte` inside the shared `StrokeIcon`. The Heidi mark is
 * the shared `HeidiMark`, not a line icon.
 */
export type Shape =
	| { d: string }
	| { cx: number; cy: number; r: number; fill?: boolean }
	| { x: number; y: number; width: number; height: number; rx?: number };

const p = (d: string): Shape => ({ d });
const c = (cx: number, cy: number, r: number, fill?: boolean): Shape => ({
	cx,
	cy,
	r,
	fill,
});
const r = (
	x: number,
	y: number,
	width: number,
	height: number,
	rx?: number,
): Shape => ({ x, y, width, height, rx });

export const ICONS = {
	plug: [p("M7 2.5v4M13 2.5v4M5 6.5h10v3a5 5 0 0 1-10 0zM10 14.5v3")],
	globe: [
		c(10, 10, 7),
		p("M3.5 8h4l1.5 2-1 3 1.5 2.5M13 4.2l-1.5 2.3 1.5 2 3.5.3"),
	],
	doc: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M8 10h5M8 13h5")],
	person: [c(10, 7, 3.2), p("M4 17c.8-3.2 3.1-4.8 6-4.8s5.2 1.6 6 4.8")],
	erp: [r(3, 3.5, 14, 5, 1.5), r(3, 11.5, 14, 5, 1.5), p("M6 6h.01M6 14h.01")],
	bars: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	bell: [p("M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0")],
	swap: [p("M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3")],
	clock: [c(10, 10, 7), p("M10 6v4l3 2")],
	signal: [
		p("M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"),
		c(10, 16, 0.8, true),
	],
	meter: [r(5, 2.5, 10, 15, 2), p("M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4")],
	calc: [
		r(4.5, 2.5, 11, 15, 2),
		p(
			"M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01",
		),
	],
	sparkle: [
		p(
			"M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z",
		),
	],
	arrow: [p("M4 10h12M11 5l5 5-5 5")],
	/** Drawn by `HeidiMark` (`Icon` switches on it). */
	heidi: [],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
