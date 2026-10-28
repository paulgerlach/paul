import { afterEach, describe, expect, it, vi } from "vitest";
import { Questionnaire } from "./questionnaire.svelte";

describe("Questionnaire", () => {
	afterEach(() => vi.useRealTimers());

	it("branches on the property count", () => {
		const q = new Questionnaire();
		q.data.property_count_category = "1-50 Immobilien";
		expect([q.isUnder50, q.lastStep, q.totalSteps]).toEqual([true, 5, 6]);
		q.data.property_count_category = "über 800 Immobilien";
		expect([q.isOver50, q.lastStep, q.totalSteps]).toEqual([true, 6, 7]);
	});

	it("keeps the step within bounds", () => {
		const q = new Questionnaire();
		q.data.property_count_category = "1-50 Immobilien";
		q.prev();
		expect(q.step).toBe(0);
		for (let i = 0; i < 10; i++) q.next();
		expect(q.step).toBe(5);
		expect(q.isSubmitStep).toBe(true);
	});

	it("won't confirm steps 0 and 1 without a selection", () => {
		const q = new Questionnaire();
		q.confirm();
		expect([q.step, q.stepError]).toEqual([0, true]);
		q.data.customer_type = "Hausverwaltung";
		q.confirm();
		expect([q.step, q.stepError]).toEqual([1, false]);
		q.confirm();
		expect([q.step, q.stepError]).toEqual([1, true]);
	});

	it("advances exactly one step when a card fires twice", () => {
		vi.useFakeTimers();
		const q = new Questionnaire();
		q.choose("customer_type", "Privatperson");
		q.choose("customer_type", "Privatperson");
		vi.advanceTimersByTime(300);
		expect(q.step).toBe(1);
		expect(q.data.customer_type).toBe("Privatperson");
	});

	it("never counts below 1", () => {
		const q = new Questionnaire();
		q.data.wohnungen_count = 1;
		q.adjust("wohnungen_count", -1);
		expect(q.data.wohnungen_count).toBe(1);
		q.adjust("wohnungen_count", 1);
		q.adjust("wohnungen_count", 1);
		expect(q.data.wohnungen_count).toBe(3);
	});

	it("shows errors only after the first submit", async () => {
		const q = new Questionnaire();
		expect(q.errors).toEqual({});
		expect(await q.submit()).toBe(false);
		expect(q.errors.email).toBeDefined();
		expect(q.status).toBe("idle");
	});
});
