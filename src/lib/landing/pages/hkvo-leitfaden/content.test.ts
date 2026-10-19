import { describe, expect, it } from "vitest";
import { closing as fristenrechnerClosing } from "$lib/landing/pages/fristenrechner/content";
import * as routes from "$lib/routes";
import {
	check,
	closing,
	faq,
	guide,
	GUIDE_ID,
	hero,
	penalties,
	PENALTIES_ID,
} from "./content";

const routeValues = Object.values(routes).filter((v) => typeof v === "string");

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

/** Every href="…" in a piece of HTML. */
const hrefs = (html: string) =>
	[...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

describe("/hkvo-leitfaden content", () => {
	it("has the design's H1 (with its soft hyphen)", () => {
		expect(`${hero.h1} ${hero.h1Accent}`.replace("­", "")).toBe(
			"Die Heizkostenverordnung. Einfach erklärt.",
		);
	});

	it("has five questions, nine articles, three penalties and five FAQ items", () => {
		expect(check.questions).toHaveLength(5);
		expect(new Set(check.questions.map((q) => q.key)).size).toBe(5);
		expect(guide.articles).toHaveLength(9);
		expect(hero.ticks[0]).toBe(`${guide.articles.length} Themen`);
		expect(penalties.cards).toHaveLength(3);
		expect(faq.items).toHaveLength(5);
	});

	it("numbers the articles 01–09 with unique ids", () => {
		expect(guide.articles.map((a) => a.num)).toEqual(
			Array.from({ length: 9 }, (_, i) => `0${i + 1}`),
		);
		const ids = guide.articles.map((a) => a.id);
		expect(new Set(ids).size).toBe(9);
		for (const id of ids) expect(id).toMatch(/^s-[a-z0-9-]+$/);
		expect(ids).not.toContain(GUIDE_ID);
		expect(ids).not.toContain(PENALTIES_ID);
	});

	it("links only to routes and anchors on the page", () => {
		expect(hero.read.href).toBe(`#${GUIDE_ID}`);
		expect(hero.penalties.href).toBe(`#${PENALTIES_ID}`);
		expect(check.link.href).toBe("#start");
		const html = [
			...guide.articles.flatMap((a) =>
				a.body.flatMap((b) => ("p" in b ? [b.p] : [])),
			),
			...faq.items.map((i) => i.answer),
		];
		const links = html.flatMap(hrefs);
		expect(links).toEqual([`#${PENALTIES_ID}`, routes.ROUTE_MIETERPORTAL]);
		for (const item of faq.items)
			if (item.more?.href) expect(routeValues).toContain(item.more.href);
		// The Heizkostenabrechnungs-Checker.
		expect(penalties.cta.link.href).toBe(
			routes.ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
		);
	});

	it("has no empty or untrimmed text", () => {
		const all = strings({ hero, check, guide, penalties, faq, closing });
		for (const text of all) {
			expect(text.length, text).toBeGreaterThan(0);
			expect(text, text).toBe(text.trim());
		}
	});

	it("shares the closing text with /fristenrechner", () => {
		expect(closing.text).toBe(fristenrechnerClosing.text);
	});
});
