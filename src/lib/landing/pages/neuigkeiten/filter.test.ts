import { describe, expect, it } from "vitest";
import { news } from "./content";
import { countText, filterOptions, shows } from "./filter";

describe("/neuigkeiten filter", () => {
	it("offers Alle and the three topics in the design's order", () => {
		expect(filterOptions(news.allLabel).map((o) => o.label)).toEqual([
			"Alle",
			"Produkt",
			"Werkzeuge",
			"Unternehmen",
		]);
	});

	it("shows the design's stories per topic", () => {
		const count = (choice: Parameters<typeof shows>[0]) =>
			news.stories.filter((story) => shows(choice, story)).length;
		expect(count("all")).toBe(9);
		expect(count("p")).toBe(6);
		expect(count("w")).toBe(1);
		expect(count("u")).toBe(2);
	});

	it("counts in German", () => {
		expect(countText(9)).toBe("9\u00a0Meldungen");
		expect(countText(1)).toBe("1\u00a0Meldung");
	});
});
