/**
 * The design's 20×20 line icons of /private-vermieter (the advantages, the
 * flow's readings), drawn by `components/Icon.svelte`.
 */
type Shape = { d: string } | { cx: number; cy: number; r: number };

export const ICONS = {
	house: [{ d: "M3 9.5L10 3.5l7 6V17H3z" }, { d: "M8 17v-4.5h4V17" }],
	wrench: [
		{
			d: "M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z",
		},
	],
	signal: [
		{
			d: "M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0",
		},
		{ cx: 10, cy: 16, r: 0.8 },
	],
	bell: [
		{ d: "M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0" },
	],
	doc: [
		{ d: "M5 2.5h7l3.5 3.5v11.5H5z" },
		{ d: "M12 2.5V6h3.5M8 10h5M8 13h5" },
	],
	swap: [{ d: "M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" }],
	drop: [
		{
			d: "M10 2.5S4.5 8.6 4.5 12.2a5.5 5.5 0 0 0 11 0C15.5 8.6 10 2.5 10 2.5z",
		},
	],
	flame: [
		{
			d: "M10 2.5c.5 3 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2.2 1.2-3.6 2.3-4.6.3 1.6 1 2.4 2 2.8C9.4 7.6 9.3 5 10 2.5z",
		},
	],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;
