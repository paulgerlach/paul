/**
 * Content shapes of the dark `uv` template (/mieterportal, /verbrauchsinformation).
 * Each page fills them in its `content.ts`; the components hold markup and
 * behaviour only.
 */
import type { Picture } from "vite-imagetools";
import type { IconName } from "./icons";

export type Link = { text: string; href: string };

/** A run of text, or a link inside it. */
export type Inline = string | Link;
/** A paragraph: plain text, or text with links. */
export type Paragraph = string | Inline[];

export type TileTone = "mint" | "ink" | "stone";

export type Row<Kind extends string = string> = {
	tag: string;
	title: [string, string];
	paragraphs: [Paragraph, Paragraph];
	tile: Kind;
	/** The tile's background (the design's t-mint, t-ink2, t-stone). */
	tone: TileTone;
	/** Replaces the rows' common second button. */
	secondary?: Link;
};

export type AppNavItem = { icon: IconName; text: string };

export type CalendarTile = {
	/** Short labels of the twelve months. */
	months: string[];
	/** Month names for the note (default: `months`). */
	long?: string[];
	/** The month being prepared; the ones before are done. */
	current: number;
	done: string;
	doing: string;
	open: string;
	/** `{x}` is the month. */
	noteDone: string;
	noteDoing: string;
};

export type DocTile = {
	title: string;
	sub: string;
	/** `share` is the bar's width in %, as designed (not computed). */
	rows: { label: string; value: string; share: number }[];
	result: string;
};

export type PhoneTile = {
	time: string;
	app: string;
	title: string;
	sub: string;
	label: string;
	value: string;
	comparisons: string[];
	/** Monthly values up to the current month; the last is accent. */
	bars: number[];
	/** The bars' full height (default: the largest bar × 1.05). */
	max?: number;
};

/**
 * `base` shows on both sides, `cut` only "without", `ok` only "with" (an `ok`
 * row without `value` shows a tick).
 */
export type BillRow = {
	kind: "base" | "cut" | "ok";
	label: string;
	value?: string;
};

export type BillTile = {
	without: string;
	with: string;
	rows: BillRow[];
	/** Either swaps its text, or counts from one amount (in €) to the other. */
	sum: { label: string } & (
		{ before: string; after: string } | { from: number; to: number }
	);
};

export type Figure = {
	value: string;
	unit?: string;
	text: string;
	/** Counts up from 0 when in view. */
	count?: number;
	/** A smaller figure (the design's .dt). */
	compact?: boolean;
};

export type AudienceCard = {
	title: string;
	text: string;
	/** Without `href` the button isn't shown. */
	cta: { text: string; href?: string };
	image: Picture;
	objectPosition?: string;
};
