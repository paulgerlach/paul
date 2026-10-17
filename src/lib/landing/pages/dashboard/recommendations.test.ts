import { describe, expect, it } from "vitest";
import { recommendations } from "./content";
import { countByKind, filterRecommendations } from "./recommendations";

const rows = recommendations.rows;

describe("recommendations", () => {
	it("counts the kinds", () => {
		expect(countByKind(rows)).toEqual({ all: 7, take: 2, cancel: 3, bill: 2 });
	});

	it("filters by kind", () => {
		expect(filterRecommendations(rows, "cancel", "")).toHaveLength(3);
		expect(filterRecommendations(rows, "all", "")).toHaveLength(7);
	});

	it("searches the name, ignoring case and spaces", () => {
		expect(
			filterRecommendations(rows, "all", "  GARTEN ").map((r) => r.name),
		).toEqual(["Gartenweg 3"]);
	});

	it("combines kind and query", () => {
		expect(filterRecommendations(rows, "take", "linden")).toHaveLength(1);
		expect(filterRecommendations(rows, "bill", "linden")).toHaveLength(0);
	});
});
