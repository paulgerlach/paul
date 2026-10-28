/**
 * The Schnell-Check's logic (the design's `upd()` in #lf-js), pure: the score
 * and the result for a set of answers. `true` is "Ja", `false` "Nein",
 * a missing key not answered yet.
 */
import type { Question, QuestionKey } from "./content";

export type Answers = Partial<Record<QuestionKey, boolean>>;

export type Outcome =
	/** Nothing answered yet. */
	| { kind: "hint" }
	/** Every question answered "Ja". */
	| { kind: "ok" }
	/** At least one "Nein": its risks, in question order. */
	| { kind: "risks"; risks: { risk: string; law: string }[] }
	/** Only "Ja" so far, `left` questions open. */
	| { kind: "open"; left: number };

/** The number of "Ja" answers. */
export function score(answers: Answers): number {
	return Object.values(answers).filter((a) => a === true).length;
}

export function outcome(questions: Question[], answers: Answers): Outcome {
	const answered = questions.filter((q) => answers[q.key] !== undefined);
	if (answered.length === 0) return { kind: "hint" };
	const risks = answered
		.filter((q) => answers[q.key] === false)
		.map(({ risk, law }) => ({ risk, law }));
	if (risks.length > 0) return { kind: "risks", risks };
	if (answered.length === questions.length) return { kind: "ok" };
	return { kind: "open", left: questions.length - answered.length };
}

/** The ring's `stroke-dasharray` on a `pathLength` of 100. */
export function ringDash(yes: number, total: number): string {
	return `${total > 0 ? (yes / total) * 100 : 0} 100`;
}

/** "Noch 2 Fragen offen.", with the singular the design lacks. */
export function openText(left: number): string {
	return `Noch ${left} ${left === 1 ? "Frage" : "Fragen"} offen.`;
}
