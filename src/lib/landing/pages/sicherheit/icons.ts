/**
 * The design's 20×20 line icons on /sicherheit (pill, badge, data path,
 * table), as shapes drawn by `components/Icon.svelte` inside the shared
 * `StrokeIcon`. The principle cards' icons have animated parts and are
 * inline in `sections/Principles.svelte`.
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
	lock: [r(4.5, 9, 11, 8, 2), p("M7 9V6.5a3 3 0 0 1 6 0V9")],
	check: [p("M5 10.5l3.2 3L15 7")],
	meter: [c(10, 10, 7), p("M10 10l3-3M6.5 13.5h7")],
	gateway: [
		p("M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"),
		c(10, 16, 0.8, true),
	],
	server: [
		r(3, 3.5, 14, 5, 1.5),
		r(3, 11.5, 14, 5, 1.5),
		p("M6 6h.01M6 14h.01"),
	],
	chart: [p("M3 17h14M6 14V9M10 14V5M14 14v-3")],
	file: [p("M5 2.5h7l3.5 3.5v11.5H5z"), p("M12 2.5V6h3.5M8 10h5M8 13h5")],
	users: [
		c(8, 7, 3),
		p(
			"M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2",
		),
	],
	building: [p("M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2")],
	clipboard: [
		r(4.5, 3.5, 11, 14, 2),
		p("M7.5 3.5V2.5h5v1M7.5 9l1.8 1.8L13 7.5M7.5 14h5"),
	],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
