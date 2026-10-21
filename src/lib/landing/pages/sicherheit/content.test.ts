import { describe, expect, it } from "vitest";
import { ADDRESS } from "$lib/company";
import { COMPANY, DATA_ID, faq, hero, table } from "./content";

describe("/sicherheit content", () => {
	it("has the design's H1", () => {
		expect(hero.h1 + hero.h1Accent).toBe("Ihre Daten bleiben in Deutschland.");
	});

	it("has six complete table rows", () => {
		expect(table.rows.map((r) => r.name)).toEqual([
			"Verbrauchsdaten",
			"Liegenschaften und Einheiten",
			"Mieterdaten",
			"Rechnungen aus DocuScan",
			"Heizkostenabrechnungen",
			"Dashboard",
		]);
		for (const row of table.rows) {
			expect(row.purpose).not.toBe("");
			expect(row.detail).not.toBe("");
		}
	});

	it("has five answered questions", () => {
		expect(faq.items).toHaveLength(5);
		for (const item of faq.items) expect(item.answer).not.toBe("");
	});

	it("uses non-breaking spaces after §", () => {
		const text = JSON.stringify(table.rows);
		expect(text).toContain("§ 6a HeizkostenV");
		expect(text).not.toMatch(/§ /);
	});

	it("names the same company as the footer", () => {
		expect(COMPANY.name).toBe(ADDRESS.company);
		expect(COMPANY.city).toBe(ADDRESS.city);
		expect(COMPANY.street).toBe(ADDRESS.street.replace("pl.", "platz"));
	});

	it("links to the table section", () => {
		expect(hero.data.href).toBe(`#${DATA_ID}`);
	});
});
