import { describe, expect, it } from "vitest";
import { closing as presseClosing } from "$lib/landing/pages/presse/content";
import * as routes from "$lib/routes";
import {
	CLAUSE_KEYS,
	checklist,
	closing,
	faq,
	FIELD_KEYS,
	generator,
	GENERATOR_ID,
	hero,
	letterText,
	takeover,
} from "./content";

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

const all = { hero, generator, letterText, checklist, takeover, faq, closing };

describe("/muster-kuendigung content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Messdienst kündigen. In zwei Minuten.",
		);
	});

	it("has a field for every key the letter reads, each once", () => {
		const { sender, provider, properties } = generator;
		const keys = [
			...sender.fields,
			...sender.pair,
			...provider.fields,
			properties.field,
		].map((f) => f.key);
		expect(new Set(keys).size).toBe(keys.length);
		expect([...keys, "datum"].sort()).toEqual([...FIELD_KEYS].sort());
		expect(generator.clauses.items.map((c) => c.key).sort()).toEqual(
			[...CLAUSE_KEYS].sort(),
		);
		expect(
			generator.clauses.items.filter((c) => c.checked).map((c) => c.key),
		).toEqual(["ende", "ablesung", "geraete"]);
		expect(properties.terms.map((t) => t.value)).toEqual(["next", "date"]);
	});

	it("has four checks, three steps and four questions", () => {
		expect(checklist.items).toHaveLength(4);
		expect(takeover.steps).toHaveLength(3);
		expect(faq.items.map((i) => i.question)).toEqual([
			"Muss ich bis zum Vertragsende warten, um zu Heidi zu wechseln?",
			"Wo finde ich meine Kündigungsfrist?",
			"Was passiert mit den installierten Geräten?",
			"Werden meine Eingaben gespeichert?",
		]);
	});

	it("links only to routes and anchors", () => {
		for (const href of hrefs(all))
			expect(
				routeValues.includes(href) ||
					href === "#start" ||
					href === `#${GENERATOR_ID}`,
				href,
			).toBe(true);
		// The Portfolio-Checker has no page yet (plan README, open question 2).
		expect(takeover.check.href).toBeUndefined();
	});

	it("has no empty or doubled spaces", () => {
		for (const s of strings(all)) {
			expect(s.length, JSON.stringify(s)).toBeGreaterThan(0);
			expect(s, JSON.stringify(s)).not.toMatch(/ {2}/);
		}
		// Only the split headings' first parts and the letter's joins end in a space.
		for (const s of strings({
			hero,
			checklist: checklist.items,
			takeover,
			faq,
			closing,
		}))
			expect(s.trim(), JSON.stringify(s)).toBe(s);
	});

	it("shares the closing text with /presse", () => {
		expect(closing.text).toBe(presseClosing.text);
	});
});
