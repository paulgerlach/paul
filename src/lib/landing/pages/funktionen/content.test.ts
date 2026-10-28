import { describe, expect, it } from "vitest";
import { testimonials } from "$lib/landing/data/testimonials";
import { DEADLINE } from "$lib/landing/deadline/deadline";
import * as routes from "$lib/routes";
import * as content from "./content";

const { docuscan, faq, faqItems, features, KPI, modules, quote, roles } =
	content;

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

describe("funktionen content", () => {
	it("has no empty strings or XX placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("has six hero modules and four roles with links to known routes", () => {
		expect(modules.items).toHaveLength(6);
		expect(roles.tabs.map((t) => t.name)).toEqual([
			"Verwaltung",
			"Mieter",
			"Eigentümer",
			"Monteure",
		]);
		for (const tab of roles.tabs)
			for (const item of tab.items)
				if (item.href !== undefined) expect(routeValues).toContain(item.href);
	});

	it("links the features only to known routes", () => {
		expect(features.items).toHaveLength(9);
		for (const f of features.items)
			if (f.href !== undefined) expect(routeValues).toContain(f.href);
	});

	it("has four invoices with four fields each, one of them skipped", () => {
		expect(docuscan.invoices).toHaveLength(4);
		for (const invoice of docuscan.invoices) {
			expect(invoice.fields).toHaveLength(4);
			expect(invoice.fields.at(-1)?.value).toBe(invoice.sum);
		}
		expect(docuscan.invoices.filter((i) => i.skip)).toHaveLength(1);
	});

	it("has a known quote", () => {
		expect(testimonials.map((t) => t.key)).toContain(quote.key);
	});

	it("swaps only the first FAQ answer at the deadline", () => {
		expect(faq.items).toHaveLength(7);
		const before = faqItems(DEADLINE - 1);
		const after = faqItems(DEADLINE);
		expect(before.map((i) => i.answer)).toEqual(faq.items.map((i) => i.answer));
		expect(after[0].answer).not.toBe(before[0].answer);
		expect(after.slice(1)).toEqual(before.slice(1));
	});

	it("uses the confirmed KPIs", () => {
		const install = faq.items[3].answer;
		for (const kpi of Object.values(KPI)) expect(install).toContain(kpi);
		expect(roles.tabs[1].items[2].text).toContain(KPI.notice);
	});
});
