/** The design's 20×20 line icons on /hilfe, drawn by `components/Icon.svelte`. */
export const ICON_NAMES = [
	"info",
	"search",
	"swap",
	"tool",
	"signal",
	"file",
	"server",
	"users",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
