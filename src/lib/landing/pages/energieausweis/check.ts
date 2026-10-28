/**
 * The Ausweis-Check's logic (the design's `next()` and `result()` in
 * #ea-js), pure: the step after an answer, the progress bar and the offers
 * a result lists.
 */
import type { Offer, OfferFilter, ResultKey } from "./content";

export type Step =
	{ kind: "question"; index: number } | { kind: "result"; result: ResultKey };

/** The step after answering question `index` (0–3) with `value`. */
export function answer(index: number, value: string): Step {
	if (index === 0 && value === "ja") return { kind: "result", result: "new" };
	if (index === 1 && value === "g") return { kind: "result", result: "free" };
	if (index === 2 && value === "nein")
		return { kind: "result", result: "free" };
	if (index === 3)
		return {
			kind: "result",
			result: value === "ja" ? "free" : value === "u" ? "maybe" : "must",
		};
	return { kind: "question", index: index + 1 };
}

/** The bar's width in percent: the questions done, full at a result. */
export function progress(step: Step, total: number): number {
	return step.kind === "result" ? 100 : (step.index / total) * 100;
}

/** Free choice lists every offer, otherwise only the Bedarfsausweise. */
export function resultOffers(result: ResultKey, offers: Offer[]): Offer[] {
	return result === "free" ? offers : offers.filter((o) => o.type === "b");
}

/** The offer filter "Passende Angebote ansehen" sets. */
export function filterFor(result: ResultKey): OfferFilter {
	return result === "free" ? "all" : "b";
}
