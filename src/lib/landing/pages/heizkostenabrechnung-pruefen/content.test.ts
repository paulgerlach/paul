import { describe, expect, it } from "vitest";
import * as routes from "$lib/routes";
import {
	ANSWERS,
	card,
	CHECKER_ID,
	closing,
	deadlines,
	errors,
	faq,
	hero,
	letter,
	managers,
	numbers,
	NUMBERS_ID,
	PAY_HREF,
	paywall,
	scan,
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

const all = {
	hero,
	card,
	paywall,
	letter,
	scan,
	numbers,
	errors,
	deadlines,
	managers,
	faq,
	closing,
};

describe("/heizkostenabrechnung-pruefen content", () => {
	it("has the design's H1 with its soft hyphen", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Heizkosten­abrechnung jetzt überprüfen.",
		);
	});

	it("has the design's blocks", () => {
		expect(hero.ticks).toHaveLength(3);
		expect(ANSWERS.map((a) => a.value)).toEqual(["ja", "nein", "?"]);
		expect(card.values.shares.map((s) => s.label)).toEqual([
			"Weiß nicht",
			"70 %",
			"60 %",
			"50 %",
			"unter 50 %",
			"nur nach Fläche",
		]);
		expect(paywall.lock.includes).toHaveLength(4);
		expect(numbers.studies.map((s) => s.value)).toEqual([67, 80]);
		expect(numbers.stats).toHaveLength(4);
		expect(numbers.stats.filter((s) => s.dark)).toHaveLength(1);
		expect(errors.items).toHaveLength(11);
		const kinds = errors.items.map((e) => e.kind);
		expect(kinds.filter((k) => k === "k")).toHaveLength(3);
		expect(kinds.filter((k) => k === "f")).toHaveLength(2);
		expect(kinds.filter((k) => k === "r")).toHaveLength(6);
		expect(deadlines.points).toHaveLength(3);
		expect(faq.items).toHaveLength(5);
	});

	it("marks one row of the sample bill per finding", () => {
		const { bill } = scan;
		const rows = [bill.period, bill.split, bill.co2, bill.readings].map(
			(r) => r.key,
		);
		expect(rows).toEqual(scan.findings.map((f) => f.key));
		expect(scan.done(scan.findings.length)).toBe(
			"4 Auffälligkeiten in dieser Abrechnung",
		);
	});

	it("has no payment page yet", () => {
		expect(PAY_HREF).toBeUndefined();
	});

	it("links only to routes and anchors on the page", () => {
		expect(hrefs(all).sort()).toEqual(
			[
				`#${NUMBERS_ID}`,
				`#${CHECKER_ID}`,
				// The closing card's "Jetzt prüfen ↑"
				`#${CHECKER_ID}`,
				routes.ROUTE_HEIZKOSTENABRECHNUNG,
				routes.ROUTE_DEMO_BUCHEN,
			].sort(),
		);
		for (const href of hrefs(all))
			if (href.startsWith("/")) expect(routeValues).toContain(href);
	});

	it("has no empty, doubled-space or untrimmed text", () => {
		// The share options' values ("" is "Weiß nicht") aren't text.
		const texts = strings({
			...all,
			card: {
				...card,
				values: {
					...card.values,
					shares: card.values.shares.map((s) => s.label),
				},
			},
		});
		for (const text of texts) {
			expect(text.length, text).toBeGreaterThan(0);
			expect(text, text).not.toMatch(/ {2}/);
		}
		const firstParts = new Set(
			[letter, scan, numbers, errors, deadlines].map((b) => b.h2.text),
		);
		const loose = new Set([
			hero.stat.before,
			hero.stat.after,
			card.upload.or,
			card.upload.formats,
			numbers.sourcePrefix,
			// "565 €": the unit after the counted figure.
			...numbers.stats.flatMap((s) => (s.unit ? [s.unit] : [])),
		]);
		for (const text of texts)
			if (!firstParts.has(text) && !loose.has(text))
				expect(text, text).toBe(text.trim());
	});
});
