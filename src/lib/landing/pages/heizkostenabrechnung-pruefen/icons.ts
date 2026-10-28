/**
 * The design's 20×20 line icons on /heizkostenabrechnung-pruefen, as shapes
 * drawn by `components/Icon.svelte` inside the shared `StrokeIcon`.
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
	person: [c(10, 7, 3.2), p("M4 17c.8-3.2 3.1-4.8 6-4.8s5.2 1.6 6 4.8")],
	doc: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M8 10h5M8 13h5")],
	list: [p("M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01")],
	upload: [p("M10 16V4M5 9l5-5 5 5")],
	lock: [r(4.5, 9, 11, 8, 2), p("M7 9V6.5a3 3 0 0 1 6 0V9")],
	tick: [p("M5 10.5l3.2 3L15 7")],
	clipboard: [
		r(4.5, 3.5, 11, 14, 2),
		p("M7.5 3.5V2.5h5v1M7.5 9l1.8 1.8L13 7.5M7.5 14h5"),
	],
	search: [c(9, 9, 5.5), p("M13 13l4 4")],
	chart: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	warning: [p("M10 3l7.5 13h-15z"), p("M10 8v4M10 14.3v.1")],
	calendar: [r(3, 4, 14, 13, 2), p("M3 8h14M7 2.5v3M13 2.5v3")],
	building: [p("M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2")],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
