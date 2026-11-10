/**
 * Content shapes of the light service template (`svc/`): the designs of
 * /legionellenpruefung and /hydraulischer-abgleich share every block but the
 * hero's card, the check's questions and the steps' pictures, byte for byte.
 */
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";

export type Link = { text: string; href: string };

export type HeroContent = {
	pill: string;
	h1: string;
	h1Accent: string;
	lead: string;
	/** "Bin ich …? ↓" to the check. */
	check: Link;
	/** "So läuft … ab →" to the steps. */
	steps: Link;
	ticks: string[];
};

export type UrgencyCard = {
	label: string;
	/** The figure as rendered (also the server's and the no-JS text). */
	value: string;
	sub: string;
	hot?: boolean;
	/** A figure that counts up from 0 when it comes into view (the design's `data-until`): the number and the text after it. */
	count?: { to: number; suffix: string };
};

export type UrgencyContent = {
	kicker: string;
	h2: SplitHeading;
	text: string;
	risks: string[];
	cta: Link;
	note: string;
	cards: UrgencyCard[];
};

/** A check's step: a question (by index) or a result (by key). */
export type CheckStep =
	{ kind: "question"; index: number } | { kind: "result"; result: string };

export type CheckQuestion = {
	title: string;
	hint: string;
	answers: { value: string; label: string }[];
};

/** The badge's kind: "Pflicht", "Empfehlung" or "Keine Pflicht". */
export type ResultKind = "must" | "info" | "free";

export type CheckResult = {
	key: string;
	kind: ResultKind;
	title: string;
	text: string;
};

export type CheckContent = {
	pill: string;
	h2: SplitHeading;
	lead: string;
	source: string;
	/** Ours: the card's accessible name. */
	label: string;
	/** The step line: `{n}`, and `{total}` where the design names it. */
	step: string;
	resultStep: string;
	back: string;
	questions: CheckQuestion[];
	results: CheckResult[];
	badges: Partial<Record<ResultKind, string>>;
	go: Link;
	again: string;
};

export type SplitContent = {
	pill: string;
	h2: SplitHeading;
	lead: string;
	alt: string;
	points: string[];
	source: string;
};

export type DutiesContent = {
	pill: string;
	h2: SplitHeading;
	rows: { label: string; text: string }[];
	source: string;
};

export type StepsContent = {
	pill: string;
	h2: SplitHeading;
	items: { title: string; text: string }[];
};

export type PictureContent = {
	kicker: string;
	h2: string;
	source: string;
	alt: string;
};

export type BundleItem = { text: string; href?: string; current?: boolean };

export type HeidiContent = {
	pill: string;
	h2: string;
	text: string;
	cta: Link;
	price: { from: string; value: string; unit: string };
	label: string;
	current: string;
	bundle: BundleItem[];
};

export type FaqContent = { title: string; items: FaqItem[] };

export type ClosingContent = { h2: string; cta: Link };
