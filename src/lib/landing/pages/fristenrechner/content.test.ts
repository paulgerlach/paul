import { describe, expect, it } from "vitest";
import { closing as schnittstellenClosing } from "$lib/landing/pages/schnittstellen/content";
import * as routes from "$lib/routes";
import {
	calculator,
	closing,
	faq,
	hero,
	milestones,
	portfolio,
	RECHNER_ID,
	STICHTAGE_ID,
} from "./content";
import { parseIso } from "./fristen";

const routeValues = Object.values(routes).filter((v) => typeof v === "string");

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

describe("/fristenrechner content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Jede Frist im Messdienst. Auf den Tag genau.",
		);
	});

	it("has three tabs, four milestones, four rows and five questions", () => {
		expect(calculator.tabs.map((t) => t.label)).toEqual([
			"Vertrag",
			"Eichfrist",
			"Abrechnung",
		]);
		expect(milestones.items).toHaveLength(4);
		expect(portfolio.rows).toHaveLength(4);
		expect(faq.items).toHaveLength(5);
	});

	it("lists the milestones in date order, the last one highlighted", () => {
		const dates = milestones.items.map((m) => parseIso(m.date));
		for (const d of dates) expect(d).not.toBeNull();
		expect([...dates].sort((a, b) => a! - b!)).toEqual(dates);
		expect(milestones.items.map((m) => !!m.hot)).toEqual([
			false,
			false,
			false,
			true,
		]);
	});

	it("has its defaults among the options", () => {
		const { term, renewal, notice } = calculator.contract;
		for (const field of [term, renewal, notice])
			expect(field.options.map((o) => o.value)).toContain(field.default);
		expect(calculator.calibration.type.options.map((o) => o.years)).toEqual([
			6, 5, 5,
		]);
	});

	it("links only to routes and anchors on the page", () => {
		expect(hero.calc.href).toBe(`#${RECHNER_ID}`);
		expect(hero.dates.href).toBe(`#${STICHTAGE_ID}`);
		expect(routeValues).toContain(calculator.contract.hintLink.href);
		expect(portfolio.ctas.map((c) => c.href)).toEqual([
			routes.ROUTE_PORTFOLIO_CHECKER,
			routes.ROUTE_MUSTER_KUENDIGUNG,
		]);
	});

	it("has no empty or untrimmed text", () => {
		const all = strings({
			hero,
			calculator,
			milestones,
			portfolio,
			faq,
			closing,
		});
		for (const text of all) {
			expect(text.length, text).toBeGreaterThan(0);
			// Split headings keep the space before their muted part.
			if (!text.endsWith("? ") && !text.endsWith("Termine "))
				expect(text, text).toBe(text.trim());
		}
	});

	it("shares the closing text with /plattform/schnittstellen", () => {
		expect(closing.text).toBe(schnittstellenClosing.text);
	});
});
