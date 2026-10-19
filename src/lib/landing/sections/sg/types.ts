/**
 * Content shapes of the light `sg` segment template (/wohnungsunternehmen,
 * and next /asset-manager, whose design shares every style and script block).
 * Each page fills them in its `content.ts`; the components hold markup and
 * behaviour only.
 */
import type { SplitHeading } from "$lib/landing/types";
import type { IconName } from "./icons";

export type Link = { text: string; href: string };

/**
 * A link whose page may not exist yet: without `href` it isn't rendered (or,
 * where the design's layout needs it, rendered as plain text), like the
 * landing footer's entries without a page.
 */
export type PendingLink = { text: string; href?: string };

/** A run of text, or a link inside it. */
export type Inline = string | Link;
/** A paragraph: plain text, or text with links. */
export type Paragraph = string | Inline[];

/** The design's eyebrow pill: an icon and a label. */
export type Pill = { icon: IconName; text: string };

export type SgHero = {
	pill: Pill;
	h1: string;
	/** The H1's green second part (`<em>`). */
	h1Accent: string;
	lead: string;
	primary: Link;
	/** The light button with an arrow down (an anchor on the page). */
	secondary: Link;
	ticks: string[];
};

/** The hero's unit calculator (`.sg-calc`). */
export type UnitCalc = {
	title: string;
	hint: string;
	unit: string;
	/** The slider's accessible name. */
	label: string;
	/** Units shown on load (the design's `data-units`). */
	start: number;
	/** Under the slider: left, middle (the threshold), right. */
	scale: [string, string, string];
	/** Below the threshold. */
	standard: { tag: string; ticks: string[] };
	/** From the threshold. */
	large: {
		tag: string;
		icon: IconName;
		title: string;
		ticks: string[];
		cta: Link;
	};
};

export type SegmentTab = {
	icon: IconName;
	text: string;
	/** No `href`: the page doesn't exist yet, the tab is plain text. */
	href?: string;
	/** The page itself (`aria-current="page"`). */
	current?: boolean;
};

export type SegmentTabs = { label: string; items: SegmentTab[] };

/** The dark "1000+" card (`.sg-k`). */
export type LargeStock = {
	figure: number;
	/** After the figure ("+"). */
	plus: string;
	unit: string;
	pill: Pill;
	h2: SplitHeading;
	text: string;
	cta: Link;
	/** The light second button; hidden without `href`. */
	secondary?: PendingLink;
};

/** A problem chip and Heidi's answer to it. */
export type PainItem = { problem: string; title: string; text: string };

/** "Was stört Sie heute?" (`.sg-pain`, `.sg-links`). */
export type PainPicker = {
	/** The section's anchor (the hero's second button). */
	id: string;
	pill: Pill;
	h2: SplitHeading;
	/** Accessible name of the chip group. */
	groupLabel: string;
	empty: { title: string; text: string };
	/** The count under the answers: one, and more (`{n}` is replaced). */
	count: { one: string; many: string };
	cta: Link;
	/** From this many choices the confetti fires (once). */
	celebrateFrom: number;
	items: PainItem[];
	/** The row of resource links; only those with `href` are rendered. */
	links: (PendingLink & { icon: IconName })[];
};

export type Benefit = {
	icon: IconName;
	title: string;
	text: string;
	/** The dark first card. */
	dark?: boolean;
};

/** "Was Sie mit Heidi bekommen." (`.sg-get`). */
export type Benefits = { pill: Pill; h2: SplitHeading; items: Benefit[] };

/** The text side of a feature row (`.fr-tx`). */
export type FeatureText = {
	title: string;
	text: Paragraph;
	link?: Link;
};

/** fr1: a reading per Funk. */
export type MeterTile = {
	label: string;
	value: number;
	unit: string;
	dateLabel: string;
	date: string;
	device: string;
	signal: string;
};

/** fr2: the Abrechnung counting up. */
export type BillingTile = {
	title: string;
	total: number;
	pending: string;
	done: string;
};

export type MonthlyRow = {
	unit: string;
	/** This month, kWh. */
	value: number;
	/** The month before, kWh (where the outlier's count starts). */
	previous: number;
	/** The row that turns orange and gets flagged. */
	outlier?: boolean;
};

/** fr3: monthly values, an outlier, the flag. */
export type MonthlyTile = {
	rows: MonthlyRow[];
	/** The bars' full width, kWh. */
	max: number;
	unit: string;
	same: string;
	above: string;
	cursor: string;
	toast: string;
	tag: string;
};

/** fr4: the hub feeding four systems (top left, top right, bottom left, bottom right). */
export type HubTile = {
	tiles: { icon: IconName; title: string; status: string }[];
};

export type RolloutRow = {
	name: string;
	/** Bar, 0–100. */
	progress: number;
	status: string;
	done?: boolean;
};

/** One change of the rollout loop: at `at` ms, row `row` becomes this. */
export type RolloutChange = { at: number } & RolloutRow & { row: number };

/** fr5: a rollout of a few properties. */
export type RolloutTile = {
	title: string;
	tag: string;
	/** The start state (also the server's). */
	rows: RolloutRow[];
	/** `{n}` and `{total}` are replaced. */
	count: { some: string; all: string };
	badge: string;
	note: string;
	/** The loop's changes, in order. */
	timeline: RolloutChange[];
	/** Length of one pass, ms. */
	every: number;
};

export type Row<Tile> = FeatureText & { tile: Tile };

/** The five feature rows (`.fr-sec`), in the designs' order. */
export type Features = {
	label: string;
	meter: Row<MeterTile>;
	billing: Row<BillingTile>;
	monthly: Row<MonthlyTile>;
	hub: Row<HubTile>;
	rollout: Row<RolloutTile>;
};

/** "So läuft der Wechsel" (`.sg-steps`). */
export type Steps = {
	pill: Pill;
	h2: SplitHeading;
	items: { title: string; text: string }[];
};
