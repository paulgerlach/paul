import { describe, expect, it } from "vitest";
import { isWithinBusinessHours } from "./businessHours";

// Instants are given in UTC; Berlin is UTC+2 in summer and UTC+1 in winter.
describe("isWithinBusinessHours", () => {
	it.each([
		["2026-10-05T06:00:00Z", true], // Mon 08:00 CEST, opening
		["2026-10-05T05:59:00Z", false], // Mon 07:59 CEST
		["2026-10-09T17:59:00Z", true], // Fri 19:59 CEST
		["2026-10-09T18:00:00Z", false], // Fri 20:00 CEST, closed
		["2026-10-10T10:00:00Z", false], // Saturday
		["2026-10-11T10:00:00Z", false], // Sunday
		["2026-01-05T07:00:00Z", true], // Mon 08:00 CET
		["2026-01-05T06:59:00Z", false], // Mon 07:59 CET
	])("%s → %s", (iso, open) => {
		expect(isWithinBusinessHours(new Date(iso))).toBe(open);
	});
});
