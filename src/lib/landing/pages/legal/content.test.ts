import { describe, expect, it } from "vitest";
import { page as agb } from "./agb";
import { page as datenschutz } from "./datenschutz";
import { page as impressum } from "./impressum";
import type { LegalPage } from "./types";

const PAGES: [string, LegalPage][] = [
	["impressum", impressum],
	["datenschutz", datenschutz],
	["agb", agb],
];

/** Every string the template renders with {@html}. */
const markup = (page: LegalPage) =>
	page.articles.flatMap((a) =>
		a.body.flatMap((b) => ("p" in b ? [b.p] : "list" in b ? b.list : [])),
	);

describe.each(PAGES)("%s", (_, page) => {
	it("numbers its articles 01, 02 … with unique `s-` anchors", () => {
		expect(page.articles.map((a) => a.num)).toEqual(
			page.articles.map((_, i) => String(i + 1).padStart(2, "0")),
		);
		const ids = page.articles.map((a) => a.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^s-[a-z-]+$/);
	});

	it("gives every article a body", () => {
		for (const article of page.articles)
			expect(article.body.length).toBeGreaterThan(0);
	});

	it("holds only <br>, <b>, tel:/mailto: links and the privacy page's link as markup", () => {
		const tags = markup(page).flatMap((html) => html.match(/<[^>]+>/g) ?? []);
		expect(
			tags.filter(
				(tag) =>
					!/^<(br|b|\/b|\/a|a href="(tel:\+\d+|mailto:[\w.-]+@heidisystems\.com|\/datenschutzhinweise)")>$/.test(
						tag,
					),
			),
		).toEqual([]);
	});
});

describe("agb", () => {
	it("links the privacy notice at /datenschutzhinweise", () => {
		const html = markup(agb).join("\n");
		expect(html.match(/<a href="\/datenschutzhinweise">/g)).toHaveLength(2);
		expect(html).not.toMatch(/heidisystems\.com\/datenschutz\b(?!hinweise)/);
	});

	it("numbers each part's clauses in order, but for the design's gap", () => {
		const gaps: string[] = [];
		for (const article of agb.articles) {
			let clause = "";
			let last = 0;
			for (const block of article.body) {
				if ("h3" in block) {
					clause = block.h3.match(/^[ABC] (\d+) /)![1];
					last = 0;
				} else if ("nr" in block && block.nr) {
					const [major, minor] = block.nr.split(".").map(Number);
					expect(String(major)).toBe(clause);
					if (minor !== last + 1) gaps.push(`${article.id} ${block.nr}`);
					last = minor;
				}
			}
		}
		// The design's B 2 of the device rental goes 2.1, 2.3: no 2.2
		// (ongoing-tasks/go-live-gates.md §1, legal to confirm).
		expect(gaps).toEqual(["s-gm-b 2.3"]);
	});
});
