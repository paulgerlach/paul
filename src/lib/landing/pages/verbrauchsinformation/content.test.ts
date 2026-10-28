import { describe, expect, it } from "vitest";
import { testimonials } from "$lib/landing/data/testimonials";
import { DEADLINE } from "$lib/landing/deadline/deadline";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	bill,
	calendar,
	doc,
	faq,
	faqItems,
	figures,
	hero,
	mock,
	numbers,
	phone,
	quotes,
	rotator,
	rows,
} = content;

const NB = " ";

/** Every string in a value, deeply. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

/** Every `href` in a value, deeply (also inside FAQ answers). */
function hrefs(value: unknown): string[] {
	if (typeof value === "string")
		return [...value.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
	if (Array.isArray(value)) return value.flatMap(hrefs);
	if (value && typeof value === "object")
		return Object.entries(value).flatMap(([key, v]) =>
			key === "href" && typeof v === "string" ? [v] : hrefs(v),
		);
	return [];
}

/** "1.240,00 €" → 1240 */
const euros = (s: string) =>
	Number(
		s
			.replace(/[^\d,−-]/g, "")
			.replace("−", "-")
			.replace(",", "."),
	);

const routeValues = new Set(
	Object.values(routes).filter((v) => typeof v === "string"),
);
const ANCHORS = ["#inhalt", "#faq", "#start"];

describe("verbrauchsinformation content", () => {
	it("has no empty strings or XX placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("names the page in the H1's hidden text", () => {
		expect(hero.word).toBe("uVI");
		expect(hero.srTitle).toBe(
			"uVI: Unterjährige Verbrauchsinformation mit Heidi",
		);
	});

	it("links only to known routes and anchors on the page", () => {
		for (const href of hrefs(content))
			expect([...routeValues, ...ANCHORS], href).toContain(href);
	});

	it("has four rows with two title lines and two paragraphs", () => {
		expect(rows.items).toHaveLength(4);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
	});

	it("keeps the example data consistent", () => {
		const [last, prev, lastYear, average] = mock.kpis.map((k) => k.value);
		expect(mock.bars).toHaveLength(12);
		expect(mock.bars.at(-1)).toBe(last);
		expect(mock.bars.at(-2)).toBe(prev);
		expect(doc.rows.map((r) => Number(r.value))).toEqual([
			last,
			prev,
			lastYear,
			average,
		]);
		expect(phone.value).toBe(`${last}${NB}kWh`);
		expect(phone.bars.at(-1)).toBe(last);
		const pct = (ref: number) => Math.round((1 - last / ref) * 100);
		expect(phone.comparisons).toEqual([
			`${pct(lastYear)}${NB}% unter Vorjahresmonat`,
			`${pct(average)}${NB}% unter Durchschnitt`,
		]);
		for (const v of mock.bars) expect(v).toBeLessThanOrEqual(mock.barMax);
	});

	it("makes the calendar's current month the one after the mock's", () => {
		expect(calendar.months).toHaveLength(12);
		expect(calendar.long?.[calendar.current - 1]).toBe(mock.month);
	});

	it("cuts 3 % in the bill and counts to the full share", () => {
		const base = euros(bill.rows.find((r) => r.kind === "base")!.value!);
		const cut = euros(bill.rows.find((r) => r.kind === "cut")!.value!);
		expect(cut).toBeCloseTo(-base * 0.03, 2);
		expect("from" in bill.sum).toBe(true);
		if ("from" in bill.sum) {
			expect(bill.sum.to).toBeCloseTo(base, 2);
			expect(bill.sum.from).toBeCloseTo(base + cut, 2);
		}
	});

	it("has four rotating phrases", () => {
		expect(rotator.phrases).toHaveLength(4);
	});

	it("counts only figures whose value is the count", () => {
		for (const f of [numbers.first, ...figures(0), ...figures(DEADLINE)])
			if (f.count !== undefined) expect(f.value).toBe(String(f.count));
	});

	it("uses known quotes", () => {
		const keys = testimonials.map((t) => t.key);
		expect(quotes.keys).toHaveLength(3);
		for (const key of quotes.keys) expect(keys).toContain(key);
	});

	it("has six questions", () => {
		expect(faq.items).toHaveLength(6);
		for (const item of faq.items) expect(item.answer.trim()).not.toBe("");
	});

	it("switches the deadline texts at the deadline", () => {
		const before = DEADLINE - 1;
		expect(faqItems(before)[4].answer).toContain("bis zum 31.");
		expect(faqItems(DEADLINE)[4].answer).not.toContain("bis zum 31.");
		expect(faqItems(DEADLINE)[4].more).toEqual(faq.items[4].more);
		expect(figures(before).map((f) => f.value)).toContain("31.12.2026");
		expect(figures(DEADLINE).map((f) => f.value)).not.toContain("31.12.2026");
		for (const item of faqItems(before))
			expect(item).not.toHaveProperty("answerExpired");
	});
});
