import { afterEach, describe, expect, it, vi } from "vitest";
import { AutoTabs } from "./autoTabs.svelte";

// The unit tests run in the server build, where `$effect` is a no-op, so the
// timing (advance, pause, resume) is covered by the e2e tests of /vorgehen and
// /funktionen. These cover choosing and the keys.

const key = (k: string) =>
	({ key: k, preventDefault: () => {} }) as KeyboardEvent;

describe("AutoTabs", () => {
	afterEach(() => vi.unstubAllGlobals());

	const create = () => {
		vi.stubGlobal("document", { getElementById: () => null });
		return new AutoTabs({ count: 3, intervalMs: 6000, tabId: String });
	};

	it("stops for good once a tab is chosen", () => {
		const tabs = create();
		tabs.arm();
		tabs.pause("view", false);
		expect(tabs.running).toBe(true);
		tabs.select(2);
		expect([tabs.active, tabs.auto, tabs.running]).toEqual([2, false, false]);
	});

	it("doesn't run while paused", () => {
		const tabs = create();
		tabs.arm();
		expect(tabs.running).toBe(false); // not in view yet
		tabs.pause("view", false);
		tabs.pause("focus", true);
		expect(tabs.running).toBe(false);
		tabs.pause("focus", false);
		expect(tabs.running).toBe(true);
	});

	it("moves with the arrow keys, Home and End, and wraps", () => {
		const tabs = create();
		tabs.onkeydown(key("ArrowUp"));
		expect(tabs.active).toBe(2);
		tabs.onkeydown(key("ArrowDown"));
		expect(tabs.active).toBe(0);
		tabs.onkeydown(key("End"));
		expect(tabs.active).toBe(2);
		tabs.onkeydown(key("Home"));
		expect(tabs.active).toBe(0);
		tabs.onkeydown(key("Tab"));
		expect(tabs.active).toBe(0);
	});
});
