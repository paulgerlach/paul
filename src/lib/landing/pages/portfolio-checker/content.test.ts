import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import { fileKind, formatSize, isAccepted } from "./checker";
import {
	CHECKER_ID,
	closing,
	decision,
	documents,
	exampleFiles,
	faq,
	fields,
	hero,
	how,
	nextStepsHead,
	quote,
	result,
	tool,
} from "./content";
import { ICONS } from "./icons";

const routeValues: string[] = Object.values(routes).filter(
	(v) => typeof v === "string",
);

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

/** Every `href` in a value, deep. */
const hrefs = (value: unknown): string[] =>
	value && typeof value === "object"
		? Object.entries(value).flatMap(([k, v]) =>
				k === "href" && typeof v === "string" ? [v] : hrefs(v),
			)
		: [];

const all = {
	hero,
	tool,
	exampleFiles,
	result,
	documents,
	how,
	fields,
	nextStepsHead,
	decision,
	quote,
	faq,
	closing,
};

describe("/portfolio-check content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Vertragsunterlagen hochladen. Heidi liest den Rest.",
		);
	});

	it("has five accepted example files of the right kind", () => {
		expect(exampleFiles).toHaveLength(5);
		for (const f of exampleFiles) {
			expect(fileKind(f.name), f.name).toBe(f.kind);
			expect(isAccepted(f.name, f.size), f.name).toBe(true);
		}
		expect(exampleFiles.map((f) => formatSize(f.size))).toEqual([
			"842 KB",
			"214 KB",
			"156 KB",
			"1,2 MB",
			"2,4 MB",
		]);
		expect(exampleFiles.filter((f) => f.warn)).toHaveLength(1);
	});

	it("has the sections' cards", () => {
		expect(hero.ticks).toHaveLength(3);
		expect(hero.steps).toHaveLength(4);
		expect(tool.status).toHaveLength(4);
		expect(documents.items).toHaveLength(6);
		expect(how.steps.map((s) => s.chips.length)).toEqual([3, 3, 2]);
		expect(fields.items).toHaveLength(8);
		expect(decision.cards.map((c) => !!c.dark)).toEqual([false, true]);
		for (const c of decision.cards) expect(c.points).toHaveLength(3);
		for (const icon of [
			...documents.items.map((i) => i.icon),
			...fields.items.map((i) => i.icon),
			...decision.cards.map((c) => c.icon),
		])
			expect(ICONS).toHaveProperty(icon);
	});

	it("quotes a known customer", () => {
		expect(testimonial(quote.key).name).toBe("Gotthard Werne");
	});

	it("words the evaluation's notes", () => {
		expect(result.kpis.nextNote("Am Markt 7", 163)).toBe(
			"Am Markt 7 · in 163 Tagen",
		);
		expect(result.kpis.urgentNote(1)).toBe("Hinweis mit hoher Priorität");
		expect(result.kpis.urgentNote(2)).toBe("Hinweise mit hoher Priorität");
		expect(result.own.title(1, 2)).toBe(
			"1 von 2 Dokumenten sind bereit für die Auswertung.",
		);
	});

	it("links only to routes and anchors", () => {
		for (const href of hrefs(all))
			expect(
				routeValues.includes(href) ||
					href === "#start" ||
					href === `#${CHECKER_ID}`,
				href,
			).toBe(true);
	});

	it("has no empty, doubled or untrimmed text", () => {
		for (const s of strings(all)) {
			expect(s.length, JSON.stringify(s)).toBeGreaterThan(0);
			expect(s, JSON.stringify(s)).not.toMatch(/ {2}/);
		}
		// Only the split headings' first parts and the drop zone's pieces
		// ("oder ", " · PDF, …"), the overview's labels before a date and the
		// "Gespeichert: " prefix have edge spaces.
		const pieces = new Set([
			result.heading.text,
			documents.heading.text,
			how.heading.text,
			fields.heading.text,
			nextStepsHead.heading.text,
			decision.heading.text,
			tool.or,
			tool.formats,
			result.overview.term,
			result.overview.notice,
			result.saved,
		]);
		for (const s of strings(all))
			if (!pieces.has(s)) expect(s.trim(), JSON.stringify(s)).toBe(s);
	});

	it("has the FAQ's six questions", () => {
		expect(faq.items.map((i) => i.question)).toEqual([
			"Welche Unterlagen kann ich hochladen?",
			"Was wird geprüft?",
			"Welche Daten werden extrahiert?",
			"Was passiert, wenn es Nachträge gibt?",
			"Was kostet der Portfolio-Check?",
			"Was passiert nach der Auswertung?",
		]);
		expect(closing.submitLabel).toBe("Portfolio prüfen lassen");
	});
});
