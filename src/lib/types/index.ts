import type { Snippet } from "svelte";
import type { ImageAsset } from "$lib/components/Basic/Image/types";

export type NavGroupLink = {
	title: string;
	icon: ImageAsset;
	link?: string;
};

export type NavGroupType = {
	title: string;
	route: string;
	groupTitle: string;
	groupLinks: NavGroupLink[];
	highlight: NavHighlightKey;
};

/** Which right-side panel a nav dropdown shows (see `Header/highlights`). */
export type NavHighlightKey = "geraete" | "funktionen" | "blog";

export type FooterLinkType = {
	url: string;
	text: string;
	isNeu?: boolean;
	isBeliebt?: boolean;
};

export type FooterLinkGroupType = {
	title: string;
	mainUrl: string;
	groupLinks: FooterLinkType[];
};

export type FunctionsSlideType = {
	title: string;
	subtitle: string;
	item: Snippet;
};

export type FAQItemType = {
	question: string;
	answer: string;
};
