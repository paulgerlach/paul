/** The design's 20×20 line icons on /karriere, drawn by `components/Icon.svelte`. */
export const ICON_NAMES = [
	"hkv",
	"signal",
	"file",
	"users",
	"chart",
	"tool",
	"bell",
	"server",
	"phone",
	"building",
	"cal",
	"bolt",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
