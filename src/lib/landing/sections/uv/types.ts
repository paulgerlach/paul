/**
 * Content shapes of the dark `uv` template (/mieterportal, /verbrauchsinformation,
 * /hausverwaltung).
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

/** An entry of the hero's app list (`ListMock`). */
export type ListEntry = {
	icon: IconName;
	title: string;
	sub: string;
	/** Status while the entry is being prepared, then the final one. */
	before: string;
	after: string;
};

export type CalendarTile = {
	/** Labels of the twelve cells: months, or units ("WE 01"). */
	months: string[];
	/** Cell names for the note (default: `months`). */
	long?: string[];
	/** The cell being prepared; the ones before are done. */
	current: number;
	done: string;
	doing: string;
	open: string;
	/** `{x}` is the month. */
	noteDone: string;
	noteDoing: string;
};

/**
 * A bar row (`share` is the bar's width in %, as designed, not computed), or
 * a check row: a tick, or a short value in its place (the design's .ck / .ck.v).
 */
export type DocRow =
	| { label: string; value: string; share: number }
	| { label: string; value?: string };

export type DocTile = {
	title: string;
	sub: string;
	rows: DocRow[];
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
	/** Rows under the chips (an appointment's details). */
	details?: { label: string; value: string }[];
	/** Monthly values up to the current month; the last is accent. None: no bars. */
	bars?: number[];
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
