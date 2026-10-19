import { describe, expect, it } from "vitest";
import * as routes from "$lib/routes";
import {
	CHECK_ID,
	check,
	closing,
	compare,
	faq,
	heidi,
	hero,
	OFFERS_ID,
	offers,
	scale,
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

const all = { hero, scale, check, offers, compare, heidi, faq, closing };

describe("/energieausweis content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Der Energieausweis für Ihre Liegenschaft. Einfach online beantragen.",
		);
	});

	it("has nine classes and the two examples", () => {
		expect(scale.classes).toHaveLength(9);
		expect(scale.types.map((t) => [t.key, t.value])).toEqual([
			["v", 118],
			["b", 142],
		]);
	});

	it("has four questions and the four results", () => {
		const keys = check.questions.map((q) => q.key);
		expect(new Set(keys).size).toBe(4);
		expect(check.results.map((r) => [r.key, r.kind])).toEqual([
			["new", "must"],
			["must", "must"],
			["maybe", "must"],
			["free", "free"],
		]);
	});

	it("has four offers, one recommended", () => {
		expect(offers.items.map((o) => o.type)).toEqual(["v", "b", "b", "b"]);
		expect(
			offers.items.filter((o) => o.recommended).map((o) => o.title),
		).toEqual(["Bedarfsausweis Video"]);
		expect(offers.filter.options.map((o) => o.value)).toEqual([
			"all",
			"v",
			"b",
		]);
	});

	it("compares with the cheapest offer of each type", () => {
		const price = compare.rows.find((r) => r.label === "Preis");
		const cheapest = (type: string) =>
			offers.items.find((o) => o.type === type)?.price;
		expect(price?.v).toBe(`${offers.from} ${cheapest("v")}`);
		expect(price?.b).toBe(`${offers.from} ${cheapest("b")}`);
	});

	it("links only to routes and anchors", () => {
		for (const href of hrefs(all))
			expect(
				routeValues.includes(href) ||
					href === "#start" ||
					href === `#${CHECK_ID}` ||
					href === `#${OFFERS_ID}`,
				href,
			).toBe(true);
	});

	it("has no empty, doubled or untrimmed text", () => {
		for (const s of strings(all)) {
			expect(s.length, JSON.stringify(s)).toBeGreaterThan(0);
			expect(s, JSON.stringify(s)).not.toMatch(/ {2}/);
		}
		// Only the split headings' first parts end in a space.
		const headings = new Set([check.h2.text, offers.h2.text, compare.h2.text]);
		for (const s of strings(all))
			if (!headings.has(s)) expect(s.trim(), JSON.stringify(s)).toBe(s);
		for (const s of headings) expect(s).toMatch(/\S $/);
	});

	it("has the FAQ's four questions", () => {
		expect(faq.items.map((i) => i.question)).toEqual([
			"Wann brauche ich einen Energieausweis?",
			"Wie lange ist ein Energieausweis gültig?",
			"Welche Daten braucht der Verbrauchsausweis?",
			"Wie bestelle ich den Ausweis?",
		]);
	});
});
