import { describe, expect, it } from "vitest";
import { START_HREF } from "$lib/landing/cta";
import { ICONS } from "$lib/landing/pages/dashboard/icons";
import * as routes from "$lib/routes";
import {
	closing,
	compare,
	heatmap,
	hero,
	hints,
	METRIC_KEYS,
	metrics,
	mock,
	MONTHS,
	properties,
	report,
	steps,
} from "./content";
import { average, deviation, signedPercent } from "./metrics";

const routeValues = Object.values(routes).filter((v) => typeof v === "string");

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

const all = { hero, mock, steps, compare, heatmap, hints, report, closing };

describe("/auswertung content", () => {
	it("has the design's H1", () => {
		expect(hero.h1.join(" ")).toBe("Ihre Verbräuche. Klar ausgewertet.");
	});

	it("has seven properties with 188 units and a value for each", () => {
		expect(properties).toHaveLength(7);
		expect(properties.reduce((n, p) => n + p.units, 0)).toBe(188);
		expect(mock.sub).toContain(`${properties.length} Liegenschaften`);
		for (const key of METRIC_KEYS)
			expect(metrics[key].values).toHaveLength(properties.length);
	});

	it("agrees with the heating values in the mock-up", () => {
		const avg = average(metrics.heiz.values);
		expect(Math.round(avg)).toBe(mock.kpis[0].value);
		const top = metrics.heiz.values.indexOf(Math.max(...metrics.heiz.values));
		expect(mock.notes[0].title).toBe(properties[top].name);
		expect(mock.notes[0].text).toContain(
			`${deviation(metrics.heiz.values[top], avg)}\u00a0%`,
		);
		expect(signedPercent(28)).toBe("+28 %");
		expect(Math.round(average(metrics.ww.values) * 10) / 10).toBe(
			mock.kpis[1].value,
		);
	});

	it("has three steps with two tickers each", () => {
		expect(steps.cards.map((c) => c.n)).toEqual(["01", "02", "03"]);
		for (const card of steps.cards) expect(card.tickers).toHaveLength(2);
	});

	it("has a full year for every property in the heatmap", () => {
		expect(MONTHS).toHaveLength(12);
		expect(heatmap.rows).toHaveLength(properties.length);
		for (const row of heatmap.rows) expect(row).toHaveLength(12);
	});

	it("has five notes, every kind in the filter", () => {
		expect(hints.items).toHaveLength(5);
		const kinds = hints.filters.map((f) => f.value);
		for (const item of hints.items) expect(kinds).toContain(item.kind);
		expect(hints.count(5)).toBe("5 Hinweise");
		expect(hints.count(1)).toBe("1 Hinweis");
	});

	it("has nine report bars", () => {
		expect(report.doc.bars).toHaveLength(9);
	});

	it("uses only known icons", () => {
		const icons = [
			steps.pill.icon,
			...steps.cards.map((c) => c.icon),
			compare.pill.icon,
			heatmap.pill.icon,
			hints.pill.icon,
			report.pill.icon,
			...report.formats.map((f) => f.icon),
		];
		for (const icon of icons) expect(Object.keys(ICONS)).toContain(icon);
	});

	it("links only to routes or the signup form", () => {
		for (const href of [hero.primary.href, hero.secondary.href])
			expect([...routeValues, START_HREF]).toContain(href);
	});

	it("has the closing card's texts", () => {
		expect(`${closing.h2} ${closing.h2Accent}`).toBe(
			"Sehen Sie, was in Ihren Verbräuchen steckt.",
		);
		expect(closing.submitLabel).toBe("Bestand kostenlos prüfen");
	});

	it("has no empty, untrimmed or doubled-space text", () => {
		for (const text of strings(all)) {
			expect(text.trim()).not.toBe("");
			expect(text).toBe(text.trim());
			expect(text).not.toMatch(/ {2}/);
		}
	});
});
