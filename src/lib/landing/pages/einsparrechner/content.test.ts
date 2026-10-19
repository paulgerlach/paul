import { describe, expect, it } from "vitest";
import { closing as fristenrechnerClosing } from "$lib/landing/pages/fristenrechner/content";
import * as routes from "$lib/routes";
import { calculator, closing, faq, hero, method } from "./content";

const routeValues = Object.values(routes).filter((v) => typeof v === "string");

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

describe("/einsparrechner content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Was der Wechsel Ihrem Bestand bringt.",
		);
	});

	it("has seven sliders in two groups, two toggles, three cards and four FAQ items", () => {
		const { fields, groups, toggles } = calculator;
		expect(fields).toHaveLength(7);
		expect(new Set(fields.map((f) => f.id)).size).toBe(7);
		expect(groups.map((g) => g.num)).toEqual([1, 2, 3]);
		expect(fields.filter((f) => f.group === 1)).toHaveLength(4);
		expect(fields.filter((f) => f.group === 2)).toHaveLength(3);
		expect(toggles.map((t) => t.id)).toEqual(["fern", "uvi"]);
		expect(method.cards).toHaveLength(3);
		expect(faq.items).toHaveLength(4);
	});

	it("puts every default inside its range and on its step", () => {
		for (const f of calculator.fields) {
			expect(f.default, f.id).toBeGreaterThanOrEqual(f.min);
			expect(f.default, f.id).toBeLessThanOrEqual(f.max);
			const steps = (f.default - f.min) / f.step;
			expect(Math.abs(steps - Math.round(steps)), f.id).toBeLessThan(1e-9);
		}
	});

	it("names the inputs in the formulas", () => {
		expect(method.cards[0].formula).toBe(
			"Stunden × Liegenschaften × Stundensatz",
		);
		expect(method.cards[1].formula).toBe("Heizkosten × Einheiten × 3 %");
	});

	it("links only to routes and the closing form", () => {
		expect(calculator.result.cta.href).toBe("#start");
		const html = faq.items.map((i) => i.answer).join(" ");
		expect(html).not.toContain("href=");
		const more = faq.items.flatMap((i) => (i.more ? [i.more] : []));
		expect(more).toEqual([
			{
				text: "Kündigungsfrist berechnen →",
				href: routes.ROUTE_FRISTENRECHNER,
			},
		]);
		for (const m of more) expect(routeValues).toContain(m.href);
	});

	it("has no empty or untrimmed text", () => {
		const all = strings({ hero, calculator, method, faq, closing }).filter(
			// A slider without a unit.
			(t) => t !== "",
		);
		for (const text of all) expect(text, text).toBe(text.trim());
		const empty = calculator.fields.filter((f) => f.unit === "");
		expect(empty.map((f) => f.id)).toEqual(["lg"]);
	});

	it("shares the closing text with /fristenrechner", () => {
		expect(closing.text).toBe(fristenrechnerClosing.text);
	});
});
