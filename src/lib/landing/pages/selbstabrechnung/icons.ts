/** The design's line icons on /selbstabrechnung, drawn by `components/Icon.svelte`. */
export const ICON_NAMES = [
	"calc",
	"file",
	"sparkle",
	"swap",
	"user",
	"users",
	"info",
	"signal",
	"meter",
	"server",
	"chart",
	"bell",
	"flame",
	"drop",
	"tap",
	"heidi",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
