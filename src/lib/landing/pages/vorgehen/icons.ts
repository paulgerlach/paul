/** The design's line icons on /vorgehen (the feature cards), drawn by `components/Icon.svelte`. */
export const ICON_NAMES = [
	"signal",
	"chart",
	"file",
	"check",
	"users",
	"tool",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
