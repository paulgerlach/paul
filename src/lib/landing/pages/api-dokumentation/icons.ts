/**
 * The design's 20×20 line icons on /api, as shapes drawn by
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
	/** The server rack: the pill and Heidi's role. */
	rack: [r(3, 3.5, 14, 5, 1.5), r(3, 11.5, 14, 5, 1.5), p("M6 6h.01M6 14h.01")],
	building: [p("M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2")],
	bars: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	swap: [p("M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3")],
	doc: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M8 10h5M8 13h5")],
	list: [p("M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01")],
	info: [c(10, 10, 7), p("M10 9v5M10 6.2v.1")],
	/** The source line's link icon. */
	source: [p("M8 6h4v11.5H8zM10 6V3.5M10 3.5h4.5l1 1.5M8 9h4")],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
