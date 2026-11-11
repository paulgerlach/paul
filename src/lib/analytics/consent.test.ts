import { describe, expect, it } from "vitest";
import {
	CONSENT_MAX_AGE,
	consentUpdate,
	parseConsent,
	serializeConsent,
} from "./consent";

describe("parseConsent", () => {
	const now = 1_800_000_000_000;

	it("reads a stored choice", () => {
		const raw = serializeConsent({ analytics: true, at: now - 1000 });
		expect(parseConsent(raw, now)).toEqual({ analytics: true, at: now - 1000 });
	});

	it("asks again after 12 months", () => {
		const raw = serializeConsent({
			analytics: true,
			at: now - CONSENT_MAX_AGE,
		});
		expect(parseConsent(raw, now)).toBeNull();
	});

	it("ignores missing, broken and future values", () => {
		for (const raw of [
			null,
			"",
			"{",
			"null",
			'"yes"',
			'{"analytics":"true","at":1}',
			serializeConsent({ analytics: false, at: now + 60_000 }),
		])
			expect(parseConsent(raw, now)).toBeNull();
	});
});

describe("consentUpdate", () => {
	it("grants or denies analytics storage only", () => {
		expect(consentUpdate({ analytics: true })).toEqual({
			analytics_storage: "granted",
		});
		expect(consentUpdate({ analytics: false })).toEqual({
			analytics_storage: "denied",
		});
	});
});
