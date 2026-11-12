/**
 * The check "Bin ich verpflichtet?" (the design's #wiz-js), pure: the step
 * after an answer and the progress bar.
 */
import type { CheckStep } from "$lib/landing/sections/svc/types";
import type { ResultKey } from "./content";

export type Step =
	{ kind: "question"; index: number } | { kind: "result"; result: ResultKey };

/** The step after answering question `index` (0–2) with `value`. */
export function answer(index: number, value: string): Step {
	if (index === 0 && value === "alt") return { kind: "result", result: "old" };
	if (index === 1 && value === "k") return { kind: "result", result: "small" };
	if (index === 2)
		return { kind: "result", result: value === "ja" ? "must" : "nowater" };
	return { kind: "question", index: index + 1 };
}

/** The bar's width in percent: 25 per answered question up to 90, full at a result. */
export function progress(step: CheckStep): number {
	return step.kind === "result" ? 100 : Math.min(90, step.index * 25);
}
