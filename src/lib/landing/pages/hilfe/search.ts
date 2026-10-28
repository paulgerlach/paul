/**
 * The search of /hilfe: pure, shared by `load` (the no-JS `?q=` render) and
 * the browser (live search), so both agree on the results.
 *
 * Case and diacritics are ignored ("lauft" finds "läuft", "strasse" finds
 * "Straße"). A query is split into words of 2+ letters, and every word must
 * occur in the question, its answer or its topic's title.
 */
import type { Topic } from "./content";

/** Longest query that's read from the URL or searched. */
export const MAX_QUERY = 100;

/** The `q` search parameter, trimmed and capped; "" when absent. */
export const readQuery = (url: URL) =>
	(url.searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY);

const foldChar = (char: string) =>
	char
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.replace(/ß/g, "ss");

/** Lowercase, without diacritics, `ß` as `ss`. */
export const normalize = (text: string) => Array.from(text, foldChar).join("");

/** The words of a query that count: normalized, 2+ characters, unique. */
export const terms = (query: string) => [
	...new Set(
		normalize(query.slice(0, MAX_QUERY))
			.split(/\s+/)
			.filter((word) => word.length > 1),
	),
];

/** Every term occurs in the question, its answer or the topic's title. */
export function matches(
	question: { question: string; answer: string },
	topicTitle: string,
	searchTerms: string[],
) {
	if (!searchTerms.length) return true;
	const haystack = normalize(
		`${question.question} ${question.answer} ${topicTitle}`,
	);
	return searchTerms.every((term) => haystack.includes(term));
}

export type SearchResult = {
	terms: string[];
	/** The ids of the matching questions (all of them without terms). */
	ids: Set<string>;
	count: number;
	/** 1–3 results for a real query: their cards open (the design's rule). */
	autoOpen: boolean;
};

export function search(topics: Topic[], query: string): SearchResult {
	const searchTerms = terms(query);
	const ids = new Set<string>();
	for (const topic of topics)
		for (const question of topic.questions)
			if (matches(question, topic.title, searchTerms)) ids.add(question.id);
	return {
		terms: searchTerms,
		ids,
		count: ids.size,
		autoOpen: searchTerms.length > 0 && ids.size > 0 && ids.size <= 3,
	};
}

export type Segment = { text: string; hit: boolean };

/**
 * `text` split into segments, with `hit` on the parts that match a term
 * (ignoring case and diacritics). Positions map back to the original string,
 * since folding can change the length (`ß` → `ss`). Overlapping and adjacent
 * matches merge.
 */
export function highlight(text: string, searchTerms: string[]): Segment[] {
	if (!searchTerms.length) return [{ text, hit: false }];

	// The folded text, and for each of its characters the original's range.
	let folded = "";
	const starts: number[] = [];
	const ends: number[] = [];
	let offset = 0;
	for (const char of text) {
		const part = foldChar(char);
		folded += part;
		for (let i = 0; i < part.length; i++) {
			starts.push(offset);
			ends.push(offset + char.length);
		}
		offset += char.length;
	}

	const ranges: [number, number][] = [];
	for (const term of searchTerms) {
		let at = folded.indexOf(term);
		while (at !== -1) {
			ranges.push([starts[at], ends[at + term.length - 1]]);
			at = folded.indexOf(term, at + 1);
		}
	}
	if (!ranges.length) return [{ text, hit: false }];

	ranges.sort((a, b) => a[0] - b[0]);
	const merged: [number, number][] = [ranges[0]];
	for (const [start, end] of ranges.slice(1)) {
		const last = merged[merged.length - 1];
		if (start <= last[1]) last[1] = Math.max(last[1], end);
		else merged.push([start, end]);
	}

	const segments: Segment[] = [];
	let pos = 0;
	for (const [start, end] of merged) {
		if (start > pos)
			segments.push({ text: text.slice(pos, start), hit: false });
		segments.push({ text: text.slice(start, end), hit: true });
		pos = end;
	}
	if (pos < text.length) segments.push({ text: text.slice(pos), hit: false });
	return segments;
}
