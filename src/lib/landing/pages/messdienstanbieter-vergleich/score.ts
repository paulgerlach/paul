/**
 * Step 1's score, pure (the design's `score()`): the visitor's answer per
 * criterion, the counts, the verdict and the criteria where Heidi is ahead.
 */
import { score } from "./content";

/** "Ja", "Nein", "?" (unclear) or not answered yet. */
export type Answer = "y" | "n" | "u" | null;

/** The same answer again clears it, as in the design. */
export const toggle = (current: Answer, picked: Exclude<Answer, null>) =>
	current === picked ? null : picked;

export function tally(answers: readonly Answer[]) {
	const count = (a: Answer) => answers.filter((x) => x === a).length;
	const yes = count("y");
	const no = count("n");
	const unsure = count("u");
	return { yes, no, unsure, answered: yes + no + unsure };
}

const plural = (n: number, texts: { one: string; many: string }) =>
	n === 1 ? texts.one : texts.many.replace("{n}", String(n));

/** The design's four texts for the counts. */
export function verdict(answers: readonly Answer[]): string {
	const total = answers.length;
	const { yes, answered } = tally(answers);
	const v = score.verdicts;
	if (!answered) return v.empty;
	if (answered < total) return plural(total - answered, v.open);
	if (yes === total) return v.all;
	return plural(total - yes, v.ahead);
}

/** The criteria answered "Nein" or "?", in their order. */
export const gaps = (answers: readonly Answer[]) =>
	answers.flatMap((a, index) =>
		a === "n" || a === "u" ? [{ index, unsure: a === "u" }] : [],
	);
