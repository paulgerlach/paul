/**
 * The design's 20×20 line icons on /plattform/dashboard (the page and the preview),
 * as shapes drawn by `components/Icon.svelte` inside the shared `StrokeIcon`.
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

const FILE = [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M8 10h5M8 13h5")];

export const ICONS = {
	// Page
	flame: [
		p(
			"M10 2.5c.5 3 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2.2 1.2-3.6 2.3-4.6.3 1.6 1 2.4 2 2.8C9.4 7.6 9.3 5 10 2.5z",
		),
	],
	euro: [p("M14.5 5.5A5.5 5.5 0 1 0 14.5 14.5M3.5 8.5h7M3.5 11.5h7")],
	bell: [p("M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0")],
	sparkle: [
		p(
			"M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z",
		),
	],
	key: [c(7, 13, 3.5), p("M9.5 10.5l6-6M13 7l2 2M15.5 4.5l1.5 1.5")],
	plug: [p("M7 2.5v4M13 2.5v4M5 6.5h10v3a5 5 0 0 1-10 0zM10 14.5v3")],
	star: [
		p("M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"),
	],
	info: [c(10, 10, 7), p("M10 9v5M10 6.2v.1")],
	swap: [p("M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3")],
	server: [
		r(3, 3.5, 14, 5, 1.5),
		r(3, 11.5, 14, 5, 1.5),
		p("M6 6h.01M6 14h.01"),
	],
	drop: [
		p("M10 2.5S4.5 8.6 4.5 12.2a5.5 5.5 0 0 0 11 0C15.5 8.6 10 2.5 10 2.5z"),
	],
	signal: [
		p("M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"),
		c(10, 16, 0.8),
	],
	tower: [
		r(4, 2.5, 12, 15, 1),
		p("M7.5 6h1M11.5 6h1M7.5 9.5h1M11.5 9.5h1M8.5 17.5v-3h3v3"),
	],
	take: [p("M4 7h11l-3-3M16 13H5l3 3")],
	cancel: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M8 11.5l4 4M12 11.5l-4 4")],
	bill: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M8 10h5M8 13h3.5")],
	calendar: [r(3, 4, 14, 13, 2), p("M3 8h14M7 2.5v3M13 2.5v3")],
	tool: [
		p(
			"M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z",
		),
	],
	// Preview (the design's IC set)
	building: [p("M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2")],
	chevron: [p("M5 8l5 5 5-5")],
	chevronRight: [p("M8 5l5 5-5 5")],
	clock: [c(10, 10, 7), p("M10 6v4l3 2")],
	home: [p("M3 9.5L10 3.5l7 6V17H3z"), p("M8 17v-4.5h4V17")],
	meter: [c(10, 10, 7), p("M10 10l3-3M6.5 13.5h7")],
	file: FILE,
	filePlus: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M10 9v6M7 12h6")],
	calculator: [
		r(4.5, 2.5, 11, 15, 2),
		p(
			"M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01",
		),
	],
	user: [c(10, 7, 3.2), p("M4 17c.8-3.2 3.1-4.8 6-4.8s5.2 1.6 6 4.8")],
	users: [
		c(8, 7, 3),
		p(
			"M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2",
		),
	],
	language: [
		p(
			"M3 5h8M7 3v2M5 5c.5 2.8 2.5 5 5 6M9 5c-.7 3-2.6 5.3-5.5 6.5M11 17l3-7 3 7M12 15h4",
		),
	],
	expand: [p("M12 3.5h4.5V8M8 16.5H3.5V12M16.5 3.5l-5 5M3.5 16.5l5-5")],
	tap: [
		p("M3 8h8a3 3 0 0 1 3 3v1M6 8V5h4v3"),
		p("M14 14.5s1.3 1.5 1.3 2.3a1.3 1.3 0 0 1-2.6 0c0-.8 1.3-2.3 1.3-2.3z"),
	],
	tapHot: [
		p("M3 8h8a3 3 0 0 1 3 3v1M6 8V5h4v3"),
		p(
			"M14 14.5s1.3 1.5 1.3 2.3a1.3 1.3 0 0 1-2.6 0c0-.8 1.3-2.3 1.3-2.3zM16.5 3.5c-.6.7.6 1.3 0 2M18.5 3.5c-.6.7.6 1.3 0 2",
		),
	],
	radiator: [
		r(3, 6, 14, 10, 2),
		p("M7 6v10M10 6v10M13 6v10M5 16v2M15 16v2M10 2.5c-.6.8.6 1.4 0 2.2"),
	],
	globe: [
		c(10, 10, 7),
		p("M3.5 8h4l1.5 2-1 3 1.5 2.5M13 4.2l-1.5 2.3 1.5 2 3.5.3"),
	],
	hkv: [r(5, 2.5, 10, 15, 2), p("M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4")],
	chart: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	close: [p("M5 5l10 10M15 5L5 15")],
	check: [p("M5 10.5l3.2 3L15 7")],
	arrow: [p("M4 10h12M11 5l5 5-5 5")],
	bolt: [p("M11 2.5L4.5 11h5l-1 6.5L15.5 9h-5z")],
	search: [c(9, 9, 5.5), p("M13 13l4 4")],
	plus: [p("M10 4v12M4 10h12")],
	download: [p("M10 3v10M5.5 8.5L10 13l4.5-4.5M4 17h12")],
	link: [
		p(
			"M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-1 1M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l1-1",
		),
	],
	smoke: [c(10, 10, 7), c(10, 10, 2.5), p("M10 3v2M10 15v2")],
	extinguisher: [p("M8 6h4v11.5H8zM10 6V3.5M10 3.5h4.5l1 1.5M8 9h4")],
	alert: [p("M10 3l7.5 13h-15z"), p("M10 8v4M10 14.3v.1")],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
