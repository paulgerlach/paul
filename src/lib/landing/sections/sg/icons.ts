/**
 * The design's 20×20 line icons of the `sg` template (pills, tabs, cards,
 * tiles), as shapes drawn by `Icon.svelte` inside the shared `StrokeIcon`.
 * `trend` is only used by the Asset-Manager design.
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
	house: [p("M3 9.5L10 3.5l7 6V17H3z"), p("M8 17v-4.5h4V17")],
	building: [p("M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2")],
	key: [c(7, 13, 3.5), p("M9.5 10.5l6-6M13 7l2 2M15.5 4.5l1.5 1.5")],
	users: [
		c(8, 7, 3),
		p(
			"M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2",
		),
	],
	bars: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	trend: [p("M3 14l4.5-4.5 3 3L17 6M12.5 6H17v4.5")],
	star: [
		p("M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"),
	],
	alert: [p("M10 3l7.5 13h-15z"), p("M10 8v4M10 14.3v.1")],
	doc: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M8 10h5M8 13h5")],
	swap: [p("M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3")],
	check: [p("M5 10.5l3.2 3L15 7")],
	sparkle: [
		p(
			"M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z",
		),
	],
	calendar: [r(3, 4, 14, 13, 2), p("M3 8h14M7 2.5v3M13 2.5v3")],
	wrench: [
		p(
			"M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z",
		),
	],
	erp: [r(3, 3.5, 14, 5, 1.5), r(3, 11.5, 14, 5, 1.5), p("M6 6h.01M6 14h.01")],
	arrow: [p("M4 10h12M11 5l5 5-5 5")],
	meter: [r(5, 2.5, 10, 15, 2), p("M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4")],
	phone: [
		p(
			"M5 3h3l1.5 4-2 1.2a9 9 0 0 0 4.3 4.3l1.2-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A14 14 0 0 1 3.5 4.6 1.5 1.5 0 0 1 5 3z",
		),
	],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
