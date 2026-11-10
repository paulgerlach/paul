/**
 * The check "Muss ich handeln?" (the design's #wiz-js), pure: the step after
 * an answer and the progress bar.
 */
import type { CheckStep } from "$lib/landing/sections/svc/types";
import type { ResultKey } from "./content";

export type Step =
	{ kind: "question"; index: number } | { kind: "result"; result: ResultKey };

/** The step after answering question `index` (0–2) with `value`. */
export function answer(index: number, value: string): Step {
	if (index === 0 && value === "neu") return { kind: "result", result: "new" };
	if (index === 1 && value === "ja") return { kind: "result", result: "renov" };
	if (index === 2)
		return { kind: "result", result: value === "ja" ? "lead" : "check" };
	return { kind: "question", index: index + 1 };
}

/** The bar's width in percent: 25 per answered question up to 90, full at a result. */
export function progress(step: CheckStep): number {
	return step.kind === "result" ? 100 : Math.min(90, step.index * 25);
}
