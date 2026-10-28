import { afterEach, describe, expect, it, vi } from "vitest";
import { checkIPRateLimit } from "./rateLimit";

describe("checkIPRateLimit", () => {
	afterEach(() => vi.useRealTimers());

	it("allows up to the limit, then blocks", () => {
		const results = Array.from({ length: 4 }, () =>
			checkIPRateLimit("10.0.0.1", 3, 60),
		);
		expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
		expect(results.map((r) => r.remaining)).toEqual([2, 1, 0, 0]);
	});

	it("counts each IP separately", () => {
		checkIPRateLimit("10.0.0.2", 1, 60);
		expect(checkIPRateLimit("10.0.0.2", 1, 60).allowed).toBe(false);
		expect(checkIPRateLimit("10.0.0.3", 1, 60).allowed).toBe(true);
	});

	it("opens a new window once the old one expires", () => {
		vi.useFakeTimers();
		checkIPRateLimit("10.0.0.4", 1, 60);
		expect(checkIPRateLimit("10.0.0.4", 1, 60).allowed).toBe(false);
		vi.advanceTimersByTime(61_000);
		expect(checkIPRateLimit("10.0.0.4", 1, 60).allowed).toBe(true);
	});
});
