/**
 * The Prüfpflicht-Check's logic (the design's `next()` in #lg-js), pure: the
 * step after an answer and the progress bar.
 */
import type { ResultKey } from "./content";

export type Step =
	{ kind: "question"; index: number } | { kind: "result"; result: ResultKey };

/** The step after answering question `index` (0–4) with `value`. */
export function answer(index: number, value: string): Step {
	if (index === 0 && value === "nein") return { kind: "result", result: "dez" };
	if (index === 1 && value === "k") return { kind: "result", result: "efh" };
	if (index === 2 && value === "nein")
		return { kind: "result", result: "self" };
	if (index === 3 && value === "nein")
		return { kind: "result", result: "nodu" };
	if (index === 4)
		return {
			kind: "result",
			result: value === "ja" ? "must" : value === "u" ? "maybe" : "small",
		};
	return { kind: "question", index: index + 1 };
}

/** The bar's width in percent: the questions done, full at a result. */
export function progress(step: Step, total: number): number {
	return step.kind === "result" ? 100 : (step.index / total) * 100;
}
