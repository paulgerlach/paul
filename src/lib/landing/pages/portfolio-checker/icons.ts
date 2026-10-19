/**
 * The design's 20×20 line icons on /portfolio-checker, as shapes drawn by
 * `components/Icon.svelte` inside the shared `StrokeIcon`.
 */
export type Shape =
	| { d: string }
	| { cx: number; cy: number; r: number }
	| { x: number; y: number; width: number; height: number; rx?: number };

const p = (d: string): Shape => ({ d });
const c = (cx: number, cy: number, r: number): Shape => ({ cx, cy, r });
const r = (
	x: number,
	y: number,
	width: number,
	height: number,
	rx?: number,
): Shape => ({ x, y, width, height, rx });

export const ICONS = {
	search: [c(9, 9, 5.5), p("M13 13l4 4")],
	upload: [p("M10 16V4M5 9l5-5 5 5")],
	sparkle: [
		p(
			"M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z",
		),
	],
	lock: [r(4.5, 9, 11, 8, 2), p("M7 9V6.5a3 3 0 0 1 6 0V9")],
	doc: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M8 10h5M8 13h5")],
	clipboard: [
		r(4.5, 3.5, 11, 14, 2),
		p("M7.5 3.5V2.5h5v1M7.5 9l1.8 1.8L13 7.5M7.5 14h5"),
	],
	euro: [p("M14.5 5.5A5.5 5.5 0 1 0 14.5 14.5M3.5 8.5h7M3.5 11.5h7")],
	gauge: [c(10, 10, 7), p("M10 10l3-3M6.5 13.5h7")],
	chart: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	people: [
		c(8, 7, 3),
		p(
			"M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2",
		),
	],
	list: [p("M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01")],
	building: [p("M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2")],
	calendar: [r(3, 4, 14, 13, 2), p("M3 8h14M7 2.5v3M13 2.5v3")],
	clock: [c(10, 10, 7), p("M10 6v4l3 2")],
	meter: [r(5, 2.5, 10, 15, 2), p("M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4")],
	warning: [p("M10 3l7.5 13h-15z"), p("M10 8v4M10 14.3v.1")],
	tick: [p("M5 10.5l3.2 3L15 7")],
	swap: [p("M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3")],
	download: [p("M10 3v10M5.5 8.5L10 13l4.5-4.5M4 17h12")],
	close: [p("M5 5l10 10M15 5L5 15")],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
