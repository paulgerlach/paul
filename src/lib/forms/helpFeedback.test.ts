import { describe, expect, it } from "vitest";
import { helpFeedbackSchema } from "./helpFeedback";

describe("helpFeedbackSchema", () => {
	it("accepts a known question and vote", () => {
		expect(
			helpFeedbackSchema.safeParse({ question: "uvi", vote: "yes" }).success,
		).toBe(true);
		expect(
			helpFeedbackSchema.safeParse({ question: "monteure", vote: "no" })
				.success,
		).toBe(true);
	});

	it("rejects unknown ids and votes", () => {
		for (const data of [
			{ question: "gibt-es-nicht", vote: "yes" },
			{ question: "uvi", vote: "vielleicht" },
			{ question: "", vote: "yes" },
			{ vote: "yes" },
		])
			expect(
				helpFeedbackSchema.safeParse(data).success,
				JSON.stringify(data),
			).toBe(false);
	});
});
