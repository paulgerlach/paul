import { describe, expect, it } from "vitest";
import { testimonials } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	calendar,
	dashboard,
	faq,
	numbers,
	phone,
	portal,
	quotes,
	rotator,
	rows,
	statementTile,
} = content;

const NB = "\u00a0";

/** Every string in a value, deeply. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

const routeValues = new Set(
	Object.values(routes).filter((v) => typeof v === "string"),
);

describe("mieterportal content", () => {
	it("has no empty strings or XX placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("has four portal entries that change their status", () => {
		expect(portal.entries).toHaveLength(4);
		for (const entry of portal.entries)
			expect(entry.before).not.toBe(entry.after);
	});

	it("has four rows with two title lines and two paragraphs", () => {
		expect(rows.items).toHaveLength(4);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
	});

	it("has a current month within the year", () => {
		expect(calendar.months).toHaveLength(12);
		expect(calendar.current).toBeGreaterThanOrEqual(0);
		expect(calendar.current).toBeLessThan(12);
	});

	it("shows the same September figure on the phone and in the portal", () => {
		const last = phone.bars.at(-1)!;
		expect(phone.value).toBe(`${last}${NB}kWh`);
		expect(portal.entries[0].sub).toContain(`${last}${NB}kWh`);
		expect(statementTile.rows[0].value).toBe(String(last));
	});

	it("has four statement rows with shares in range", () => {
		expect(statementTile.rows).toHaveLength(4);
		for (const row of statementTile.rows) {
			expect(row.share).toBeGreaterThan(0);
			expect(row.share).toBeLessThanOrEqual(100);
		}
	});

	it("has four rotating phrases", () => {
		expect(rotator.phrases).toHaveLength(4);
	});

	it("uses the confirmed KPIs", () => {
		const figures = [numbers.first, ...numbers.rest];
		expect(figures).toHaveLength(5);
		expect(
			figures.map((f) => [f.value, f.unit].filter(Boolean).join(NB)),
		).toEqual(expect.arrayContaining([`14${NB}Tage`, `1–2${NB}h`]));
		for (const f of figures)
			if (f.count !== undefined) expect(f.value).toBe(String(f.count));
	});

	it("keeps the dashboard series within their axes", () => {
		for (const chart of dashboard.charts) {
			expect(chart.values).toHaveLength(dashboard.months.length);
			expect(chart.ticks.at(-1)).toBe(chart.max);
			for (const v of chart.values) {
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThanOrEqual(chart.max);
			}
		}
		expect(dashboard.heating.bars).toHaveLength(dashboard.months.length);
	});

	it("uses known quotes", () => {
		const keys = testimonials.map((t) => t.key);
		expect(quotes.keys).toHaveLength(3);
		for (const key of quotes.keys) expect(keys).toContain(key);
	});

	it("has five FAQs that link only to known routes", () => {
		expect(faq.items).toHaveLength(5);
		for (const item of faq.items)
			if (item.more?.href !== undefined)
				expect(routeValues).toContain(item.more.href);
	});
});
