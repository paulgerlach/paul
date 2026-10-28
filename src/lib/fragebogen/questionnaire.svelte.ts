import { getContext, setContext } from "svelte";
import { z } from "zod";
import {
	questionnaireDefaults,
	questionnaireSchema,
	type QuestionnaireInput,
} from "./schema";

export type QuestionnaireField = keyof QuestionnaireInput;
export type QuestionnaireErrors = Partial<Record<QuestionnaireField, string>>;

/** Fields answered by picking a card, which moves on to the next step. */
export type ChoiceField =
	| "customer_type"
	| "property_count_category"
	| "zusammenarbeit_status"
	| "akuter_handlungsbedarf"
	| "funkzaehler_status";

export type CounterField = "messdienstleister_count" | "wohnungen_count";

/** How long a picked card stays visible before the next step shows. */
const ADVANCE_DELAY = 300;

/**
 * State of the Fragebogen wizard. Replaces Next's react-hook-form values plus
 * the Zustand step store (KI-17). One instance per page visit, through
 * context, so every visit starts fresh and SSR requests never share state.
 */
export class Questionnaire {
	data = $state<QuestionnaireInput>(structuredClone(questionnaireDefaults));
	step = $state(0);
	/** "Bestätigen" was pressed on step 0 or 1 without a selection. */
	stepError = $state(false);
	status = $state<"idle" | "submitting" | "done" | "error">("idle");
	/** Like react-hook-form: errors show after the first submit, then track every change. */
	#submitAttempted = $state(false);

	isUnder50 = $derived(this.data.property_count_category === "1-50 Immobilien");
	isOver50 = $derived(
		this.data.property_count_category === "51-800 Immobilien" ||
			this.data.property_count_category === "über 800 Immobilien",
	);
	/** Under50 submits on step 5, Over50 on step 6. */
	lastStep = $derived(this.isUnder50 ? 5 : 6);
	totalSteps = $derived(this.lastStep + 1);
	isSubmitStep = $derived(this.step === this.lastStep);

	errors: QuestionnaireErrors = $derived.by(() => {
		if (!this.#submitAttempted) return {};
		const result = questionnaireSchema.safeParse(this.data);
		return result.success ? {} : firstErrors(result.error);
	});

	next() {
		if (this.step < this.totalSteps - 1) this.step++;
	}

	prev() {
		if (this.step > 0) this.step--;
	}

	/** The "Bestätigen" button on every step but the last. */
	confirm() {
		if (
			(this.step === 0 && !this.data.customer_type) ||
			(this.step === 1 && !this.data.property_count_category)
		) {
			this.stepError = true;
			return;
		}
		this.stepError = false;
		this.next();
	}

	/**
	 * Picks a card and advances after a short delay. A label click fires twice
	 * (label, then the radio it activates), so the target step is fixed up
	 * front to keep it a single step.
	 */
	choose<K extends ChoiceField>(field: K, value: QuestionnaireInput[K]) {
		this.data[field] = value;
		const target = this.step + 1;
		setTimeout(() => {
			if (target < this.totalSteps) this.step = target;
		}, ADVANCE_DELAY);
	}

	adjust(field: CounterField, delta: 1 | -1) {
		this.data[field] = Math.max((this.data[field] || 1) + delta, 1);
	}

	/** Validates and sends. Returns false when validation failed. */
	async submit(): Promise<boolean> {
		this.#submitAttempted = true;
		const parsed = questionnaireSchema.safeParse(this.data);
		if (!parsed.success) return false;

		this.status = "submitting";
		try {
			const response = await fetch("/api/fragebogen", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(parsed.data),
			});
			this.status = response.ok ? "done" : "error";
		} catch {
			this.status = "error";
		}
		return true;
	}
}

function firstErrors(error: z.ZodError): QuestionnaireErrors {
	const errors: QuestionnaireErrors = {};
	for (const issue of error.issues) {
		const field = issue.path[0] as QuestionnaireField;
		errors[field] ??= issue.message;
	}
	return errors;
}

const KEY = Symbol("questionnaire");

export const setQuestionnaire = () => setContext(KEY, new Questionnaire());
export const getQuestionnaire = () => getContext<Questionnaire>(KEY);
