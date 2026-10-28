import { describe, expect, it } from "vitest";
import {
	countByKind,
	filterNextSteps,
	NEXT_STEP_KINDS,
	nextSteps,
} from "./nextSteps";

const rows = nextSteps.rows;

describe("nextSteps", () => {
	it("has seven rows with their own photo, each kind explained", () => {
		expect(rows).toHaveLength(7);
		expect(new Set(rows.map((r) => r.photo)).size).toBe(7);
		for (const kind of NEXT_STEP_KINDS) {
			expect(nextSteps.info[kind].steps).toHaveLength(3);
			expect(nextSteps.filters[kind]).toBeTruthy();
		}
	});

	it("counts the kinds", () => {
		expect(countByKind(rows)).toEqual({ all: 7, take: 2, cancel: 3, bill: 2 });
	});

	it("filters by kind", () => {
		expect(filterNextSteps(rows, "cancel", "")).toHaveLength(3);
		expect(filterNextSteps(rows, "all", "")).toHaveLength(7);
	});

	it("searches the name, ignoring case and spaces", () => {
		expect(
			filterNextSteps(rows, "all", "  GARTEN ").map((r) => r.name),
		).toEqual(["Gartenweg 3"]);
	});

	it("combines kind and query", () => {
		expect(filterNextSteps(rows, "take", "linden")).toHaveLength(1);
		expect(filterNextSteps(rows, "bill", "linden")).toHaveLength(0);
	});
});
