/** The design's 20×20 line icons on the dark `uv` template (app mocks, the phone), drawn by `Icon.svelte`. */
export const ICON_NAMES = [
	"chart",
	"doc",
	"users",
	"bell",
	"trend",
	"building",
	"user",
	"key",
	"home",
	"tool",
	"server",
	"check",
	"meter",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
