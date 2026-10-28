/** The design's 20×20 line icons on /funktionen (pills, badges, cards), drawn by `components/Icon.svelte`. */
export const ICON_NAMES = [
	"spark",
	"sparkles",
	"chart",
	"list",
	"tool",
	"check",
	"lock",
	"key",
	"server",
	"file",
	"users",
	"signal",
	"building",
	"bell",
	"calc",
	"home",
	"drop",
	"link",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
