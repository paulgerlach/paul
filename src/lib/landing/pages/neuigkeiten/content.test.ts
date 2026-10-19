import { describe, expect, it } from "vitest";
import { closing as schnittstellenClosing } from "$lib/landing/pages/schnittstellen/content";
import * as routes from "$lib/routes";
import { closing, deadlines, hero, news, TOPIC_LABELS } from "./content";

const routeValues = Object.values(routes).filter((v) => typeof v === "string");

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

describe("/neuigkeiten content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe("Neuigkeiten von Heidi.");
	});

	it("has nine stories and four rows", () => {
		expect(news.stories).toHaveLength(9);
		expect(deadlines.rows).toHaveLength(4);
		for (const story of [hero.featured.story, ...news.stories])
			expect(Object.keys(TOPIC_LABELS)).toContain(story.topic);
	});

	it("links only to routes", () => {
		const hrefs = [
			...news.stories.flatMap((s) => (s.more ? [s.more.href] : [])),
			hero.featured.story.more?.href,
			news.blog.href,
			...deadlines.rows.map((r) => r.href),
		].filter((href) => href !== undefined);
		expect(hrefs.length).toBeGreaterThan(0);
		for (const href of hrefs) expect(routeValues).toContain(href);
	});

	it("has the design's link texts", () => {
		expect(news.stories.flatMap((s) => (s.more ? [s.more.text] : []))).toEqual([
			"Zum Dashboard",
			"Mehr erfahren",
			"Mehr erfahren",
			"Mehr erfahren",
			"Bestand prüfen",
			"Mehr erfahren",
		]);
		expect(news.blog.text).toBe("Zum Blog mit allen Artikeln");
	});

	it("has no empty or untrimmed text", () => {
		for (const text of strings({ hero, news, deadlines, closing })) {
			expect(text.trim()).not.toBe("");
			// The split H2's first part ends in the space before its muted part.
			if (text !== deadlines.h2.text) expect(text).toBe(text.trim());
		}
	});

	it("shares the closing card's text with /schnittstellen", () => {
		expect(closing.text).toBe(schnittstellenClosing.text);
		expect(closing.submitLabel).toBe(schnittstellenClosing.submitLabel);
	});
});
