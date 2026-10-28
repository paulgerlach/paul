import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Stage, SYNC_FIRST_MS, SYNC_STEP_MS } from "./stage.svelte";

describe("Stage", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("starts on two platforms, every entry manual", () => {
		const stage = new Stage(3);
		expect(stage.mode).toBe("two");
		expect(stage.statuses).toEqual(["man", "man", "man"]);
	});

	it("syncs the entries one by one and celebrates once", () => {
		const stage = new Stage(3);
		const onSynced = vi.fn();
		stage.onSynced = onSynced;
		stage.mode = "one";
		expect(stage.statuses).toEqual(["pending", "pending", "pending"]);
		vi.advanceTimersByTime(SYNC_FIRST_MS);
		expect(stage.statuses).toEqual(["ok", "pending", "pending"]);
		vi.advanceTimersByTime(2 * SYNC_STEP_MS);
		expect(stage.statuses).toEqual(["ok", "ok", "ok"]);
		expect(onSynced).toHaveBeenCalledTimes(1);

		stage.mode = "two";
		stage.mode = "one";
		vi.runAllTimers();
		expect(onSynced).toHaveBeenCalledTimes(1);
	});

	it("cancels pending syncs when switched back", () => {
		const stage = new Stage(3);
		stage.mode = "one";
		vi.advanceTimersByTime(SYNC_FIRST_MS);
		stage.mode = "two";
		vi.runAllTimers();
		expect(stage.statuses).toEqual(["man", "man", "man"]);
	});

	it("syncs everything at once with reduced motion, without confetti", () => {
		const stage = new Stage(3, () => true);
		const onSynced = vi.fn();
		stage.onSynced = onSynced;
		stage.mode = "one";
		expect(stage.statuses).toEqual(["ok", "ok", "ok"]);
		expect(onSynced).not.toHaveBeenCalled();
	});

	it("auto-switches only if the visitor hasn't chosen", () => {
		const auto = new Stage(3);
		auto.autoSwitch();
		expect(auto.mode).toBe("one");
		expect(auto.chosen).toBe(false);

		const chosen = new Stage(3);
		chosen.mode = "two";
		chosen.autoSwitch();
		expect(chosen.mode).toBe("two");
	});
});
