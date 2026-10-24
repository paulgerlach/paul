import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
import * as content from "./content";

/** Every string in a value, depth first. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

describe("/ueber-uns content", () => {
	it("has 5 services, 4 principles with 3 points each and 4 numbers", () => {
		expect(content.services.items).toHaveLength(5);
		expect(content.principles.items).toHaveLength(4);
		for (const principle of content.principles.items)
			expect(principle.points).toHaveLength(3);
		expect(content.numbers.items).toHaveLength(4);
	});

	it("counts only the tiles whose value is the count target", () => {
		for (const tile of content.numbers.items)
			if (tile.countTo !== undefined)
				expect(tile.value).toBe(String(tile.countTo));
	});

	it("has no empty strings and no XX placeholders", () => {
		const all = strings(content);
		expect(all.length).toBeGreaterThan(50);
		for (const text of all) {
			expect(text.trim()).not.toBe("");
			expect(text).not.toMatch(/XX/);
		}
	});

	it("shows existing testimonials", () => {
		for (const key of content.testimonials.keys)
			expect(testimonial(key)).toBeDefined();
	});
});
