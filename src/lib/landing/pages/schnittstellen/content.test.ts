import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
import { START_HREF } from "$lib/landing/cta";
import * as routes from "$lib/routes";
import {
	beforeAfter,
	benefits,
	CALC_ID,
	calculator,
	dataPath,
	faq,
	hero,
	quotes,
	stage,
	steps,
} from "./content";
import { doppelpflege, type Inputs } from "./doppelpflege";

const routeValues = Object.values(routes).filter((v) => typeof v === "string");
const anchors = [START_HREF, `#${CALC_ID}`];

describe("/schnittstellen content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Eine Plattform pflegen. Nicht zwei.",
		);
	});

	it("has 5 + 3 comparison steps and three ERP items", () => {
		expect(beforeAfter.two.steps).toHaveLength(5);
		expect(beforeAfter.one.steps).toHaveLength(3);
		expect(stage.erp.items).toHaveLength(3);
		for (const s of [...beforeAfter.two.steps, ...beforeAfter.one.steps]) {
			expect(s.title).not.toBe("");
			expect(s.sub).not.toBe("");
		}
	});

	it("has four benefits, three steps and five answered questions", () => {
		expect(benefits.items).toHaveLength(4);
		expect(steps.items).toHaveLength(3);
		expect(faq.items).toHaveLength(5);
		for (const item of faq.items) expect(item.answer).not.toBe("");
	});

	it("links only to routes and anchors on the page", () => {
		const hrefs = [
			hero.demo.href,
			hero.calc.href,
			beforeAfter.one.link.href,
			...dataPath.cards.flatMap((c) => (c.link ? [c.link.href] : [])),
		];
		for (const href of hrefs)
			expect([...routeValues, ...anchors]).toContain(href);
	});

	it("has valid slider defaults that give the design's result", () => {
		for (const f of calculator.fields) {
			expect(f.default).toBeGreaterThanOrEqual(f.min);
			expect(f.default).toBeLessThanOrEqual(f.max);
			expect((f.default - f.min) % f.step).toBe(0);
		}
		const inputs = Object.fromEntries(
			calculator.fields.map((f) => [f.id, f.default]),
		) as Inputs;
		const r = doppelpflege(inputs, calculator.cells);
		expect(Math.round(r.hours)).toBe(53);
		expect(r.cost).toBe(2400);
		expect(r.lit).toBe(7);
	});

	it("has example data that agree", () => {
		// 6 flats × 3 meters (Heizung, Warm- und Kaltwasser).
		expect(stage.erp.sub).toMatch(/6\u00a0Wohnungen$/);
		expect(stage.erp.items[0].sub).toMatch(/^18\u00a0Werte · WE 01–06$/);
		expect(stage.erp.items[1].sub).toMatch(/^6\u00a0Einzelabrechnungen$/);
		// "einloggen, exportieren, weiterleiten, abtippen"
		const verbs = stage.steps.two.text.split(": ")[1].split(", ");
		expect(verbs).toHaveLength(stage.steps.two.n);
		expect(stage.steps.one.n).toBe(0);
	});

	it("quotes the design's two customers", () => {
		expect(quotes.keys).toEqual(["vitolus", "werne"]);
		expect(testimonial("vitolus").quote).toBe(
			"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
		);
		expect(testimonial("werne").quote).toBe(
			"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
		);
	});
});
