import { describe, expect, it } from "vitest";
import { formatDate } from "./index";

describe("formatDate", () => {
	it("formats an ISO date in German", () => {
		expect(formatDate("2025-03-07")).toBe("7 März 2025");
		expect(formatDate("2024-12-31")).toBe("31 Dezember 2024");
	});

	it("returns an empty string without a date", () => {
		expect(formatDate()).toBe("");
		expect(formatDate("")).toBe("");
	});
});
