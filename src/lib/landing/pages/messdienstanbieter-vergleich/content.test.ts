import { describe, expect, it } from "vitest";
import { testimonials } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import {
	BOOKING_HREF,
	closing,
	COMPARE_ID,
	costs,
	COSTS_ID,
	criteria,
	faq,
	hero,
	logos,
	quotes,
	score,
	switching,
	tips,
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
	logos,
	criteria,
	score,
	costs,
	tips,
	switching,
	quotes,
	faq,
	closing,
};

describe("/messdienst-vergleich content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Wie gut ist Ihr Messdienst wirklich?",
		);
	});

	it("has the design's blocks", () => {
		expect(hero.ticks).toHaveLength(3);
		expect(hero.peek.rows).toHaveLength(5);
		expect(criteria.items).toHaveLength(8);
		expect(new Set(criteria.items.map((c) => c.key)).size).toBe(8);
		expect(new Set(criteria.items.map((c) => c.icon)).size).toBe(8);
		for (const c of criteria.items) expect(ICONS[c.icon]).toBeDefined();
		expect(criteria.answers.map((a) => a.label)).toEqual(["Ja", "Nein", "?"]);
		const fields = costs.groups.flatMap((g) => g.fields);
		expect(fields.map((f) => f.key)).toEqual([
			"we",
			"hkv",
			"wz",
			"phkv",
			"pwz",
			"pabr",
		]);
		expect(fields.filter((f) => f.euro)).toHaveLength(3);
		expect(costs.result.legend).toHaveLength(3);
		expect(tips.items).toHaveLength(6);
		expect(tips.items.filter((t) => "link" in t)).toHaveLength(2);
		expect(switching.figures).toHaveLength(3);
		expect(faq.items).toHaveLength(4);
	});

	it("uses quotes that exist", () => {
		const keys = testimonials.map((t) => t.key);
		for (const key of quotes.keys) expect(keys).toContain(key);
	});

	it("links only to routes and anchors on the page", () => {
		expect([...new Set(hrefs(all))].sort()).toEqual(
			[
				`#${COMPARE_ID}`,
				`#${COSTS_ID}`,
				BOOKING_HREF,
				routes.ROUTE_MESSDIENSTWECHSEL,
				routes.ROUTE_UPGRADE_NOW,
			].sort(),
		);
		for (const href of hrefs(all))
			if (href.startsWith("/"))
				expect(routeValues).toContain(href.split("#")[0]);
	});

	it("has no empty, doubled-space or untrimmed text", () => {
		const texts = strings(all);
		for (const text of texts) {
			expect(text.length, text).toBeGreaterThan(0);
			expect(text, text).not.toMatch(/ {2}/);
		}
		const firstParts = new Set([criteria, costs, tips].map((b) => b.h2.text));
		for (const text of texts)
			if (!firstParts.has(text)) expect(text, text).toBe(text.trim());
	});
});
