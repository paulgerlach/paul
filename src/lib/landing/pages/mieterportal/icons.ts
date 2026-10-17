/** The design's 20×20 line icons on /mieterportal (the portal mock, the phone), drawn by `components/Icon.svelte`. */
export const ICON_NAMES = ["chart", "doc", "users", "bell", "trend"] as const;

export type IconName = (typeof ICON_NAMES)[number];
