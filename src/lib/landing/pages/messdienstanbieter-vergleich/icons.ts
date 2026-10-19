/**
 * The design's 20×20 line icons on /messdienstanbieter-vergleich, as shapes
 * drawn by `components/Icon.svelte` inside the shared `StrokeIcon`.
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
	swap: [p("M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3")],
	list: [p("M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01")],
	euro: [p("M14.5 5.5A5.5 5.5 0 1 0 14.5 14.5M3.5 8.5h7M3.5 11.5h7")],
	search: [c(9, 9, 5.5), p("M13 13l4 4")],
	info: [c(10, 10, 7), p("M10 9v5M10 6.2v.1")],
	tick: [p("M5 10.5l3.2 3L15 7")],
	signal: [
		p("M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"),
		c(10, 16, 0.8, true),
	],
	tool: [
		p(
			"M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z",
		),
	],
	bell: [p("M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0")],
	calc: [
		r(4.5, 2.5, 11, 15, 2),
		p(
			"M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01",
		),
	],
	chart: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	server: [
		r(3, 3.5, 14, 5, 1.5),
		r(3, 11.5, 14, 5, 1.5),
		p("M6 6h.01M6 14h.01"),
	],
	user: [c(10, 7, 3.2), p("M4 17c.8-3.2 3.1-4.8 6-4.8s5.2 1.6 6 4.8")],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
