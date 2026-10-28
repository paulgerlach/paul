/**
 * The check card's state (the design's `#mc-js` and `#pw-js` state): the
 * pane, the chosen files, the guided flow, the values, the result, the
 * paywall's lock and the letter. Per page via context, so every visit
 * starts empty and nothing leaks between requests on the server.
 *
 * Nothing is read from the files or sent anywhere: they only give their
 * names and, for images, a local preview (an object URL, revoked when the
 * file goes).
 */
import { getContext, setContext } from "svelte";
import { prefersReducedMotion } from "$lib/landing/motion";
import type { Day } from "$lib/landing/pages/fristenrechner/fristen";
import { card } from "./content";
import {
	emptyValues,
	evaluate,
	exampleValues,
	letterText,
	resultHead,
	type Answer,
	type Result,
	type Values,
} from "./rules";

export type Pane = "up" | "run" | "man" | "res";

export type BillFile = {
	id: number;
	name: string;
	/** A local preview of an image (`URL.createObjectURL`). */
	url?: string;
	pdf: boolean;
};

const ACCEPTED = /^image\/(jpeg|png|webp)$/;
/** The flow's wait before an answer moves on, ms (the design's). */
const ADVANCE_MS = 280;
/**
 * The example's schedule, ms after the click (the design's): the file card
 * lands, the scan pane opens, its steps tick off, the result shows.
 */
const EXAMPLE_MS = { got: 1500, run: 2300, steps: [3400, 4500], done: 5600 };

export class BillCheck {
	pane = $state<Pane>("up");
	files = $state<BillFile[]>([]);
	/** The flow's step, 0–3 ("Schritt <step + 2> von 5"). */
	step = $state(0);
	/** The flow's own date field; it copies into `values.received`. */
	flowReceived = $state("");
	values = $state<Values>(emptyValues());
	/** The result is the example's ("Beispiel"). */
	demo = $state(false);
	/** The upload pane's message (a wrong file type). */
	message = $state("");
	/** The values pane's note (no reading here). */
	valuesNote = $state("");
	result = $state<Result | null>(null);
	/** The example's file card in the drop zone: flying in, then uploaded. */
	exampleFile = $state<"fly" | "got" | null>(null);
	/** The scan pane's current step (0–2; 3 = all done). */
	runStep = $state(0);
	/** The paywall is open. */
	dialogOpen = $state(false);
	unlocked = $state(false);
	/** The letter's text, `null` until it's made (its section hidden). */
	letter = $state<string | null>(null);

	head = $derived(this.result ? resultHead(this.result) : null);
	/** The points show: paid for, or the example (the design's `lockState`). */
	open = $derived(this.unlocked || this.demo);
	flowOpen = $derived(this.files.length > 0);

	#today: () => Day;
	#nextId = 0;
	#wasDemo: boolean | null = null;
	#advance: ReturnType<typeof setTimeout> | undefined;
	#exampleTimers: ReturnType<typeof setTimeout>[] = [];

	constructor(today: () => Day) {
		this.#today = today;
	}

	/** Adds the accepted files (JPG, PNG, WebP, PDF); others show the message. */
	add(list: Iterable<File>) {
		this.message = "";
		const wasEmpty = this.files.length === 0;
		for (const file of list) {
			const pdf = file.type === "application/pdf";
			if (!pdf && !ACCEPTED.test(file.type)) {
				this.message = card.upload.wrongType;
				continue;
			}
			this.files.push({
				id: this.#nextId++,
				name: file.name,
				pdf,
				url: pdf ? undefined : URL.createObjectURL(file),
			});
		}
		if (wasEmpty && this.files.length) this.goStep(0);
	}

	remove(id: number) {
		const file = this.files.find((f) => f.id === id);
		if (file?.url) URL.revokeObjectURL(file.url);
		this.files = this.files.filter((f) => f.id !== id);
	}

	goStep(step: number) {
		clearTimeout(this.#advance);
		this.step = step;
	}

	setFlowReceived(iso: string) {
		this.flowReceived = iso;
		this.values.received = iso;
	}

	/** "Weiß ich nicht": no date, on to the next step. */
	skipReceived() {
		this.flowReceived = "";
		this.goStep(1);
	}

	/** An answer in either pane; in the flow it moves on after a moment. */
	answer(key: "co2" | "remote" | "uvi", value: Answer, inFlow = false) {
		this.values[key] = value;
		if (!inFlow) return;
		const step = this.step;
		clearTimeout(this.#advance);
		this.#advance = setTimeout(() => {
			if (this.step === step) this.goStep(step + 1);
		}, ADVANCE_MS);
	}

	showPane(pane: Pane) {
		this.#stopExample();
		this.pane = pane;
	}

	/** "Abrechnung prüfen": nothing reads the bill here, so the values pane opens with the note. */
	checkFiles() {
		this.#stopExample();
		this.message = "";
		this.demo = false;
		this.valuesNote = card.upload.noReading;
		this.pane = "man";
	}

	/** "Ergebnis anzeigen" (the design's `compute()`). */
	compute() {
		this.result = evaluate($state.snapshot(this.values), this.#today());
		// A result for own values after an unlocked example locks again.
		if (this.#wasDemo === true && !this.demo) this.unlocked = false;
		this.#wasDemo = this.demo;
		this.letter = null;
		this.pane = "res";
	}

	/**
	 * "Beispiel ansehen": the file card flies into the drop zone, the scan
	 * pane ticks off its steps, then the example's result (at once with
	 * reduced motion).
	 */
	example() {
		this.#stopExample();
		if (prefersReducedMotion()) {
			this.#fillExample();
			return;
		}
		this.pane = "up";
		this.exampleFile = "fly";
		const at = (ms: number, fn: () => void) =>
			this.#exampleTimers.push(setTimeout(fn, ms));
		at(EXAMPLE_MS.got, () => (this.exampleFile = "got"));
		at(EXAMPLE_MS.run, () => {
			this.exampleFile = null;
			this.runStep = 0;
			this.pane = "run";
		});
		EXAMPLE_MS.steps.forEach((ms, i) => at(ms, () => (this.runStep = i + 1)));
		at(EXAMPLE_MS.done, () => {
			this.#exampleTimers = [];
			this.runStep = 3;
			this.#fillExample();
		});
	}

	/** "Abbrechen" in the scan pane. */
	cancelExample() {
		this.#stopExample();
		this.pane = "up";
	}

	#stopExample() {
		this.#exampleTimers.forEach(clearTimeout);
		this.#exampleTimers = [];
		this.exampleFile = null;
	}

	#fillExample() {
		this.demo = true;
		this.values = exampleValues(this.#today());
		this.compute();
	}

	/** "Neue Abrechnung prüfen". */
	reset() {
		this.#stopExample();
		for (const file of this.files) if (file.url) URL.revokeObjectURL(file.url);
		this.files = [];
		this.demo = false;
		this.values = emptyValues();
		this.flowReceived = "";
		this.message = "";
		this.valuesNote = "";
		this.letter = null;
		this.goStep(0);
		this.pane = "up";
	}

	/** "Beispiel kostenlos freischalten" (the example only). */
	unlock() {
		this.unlocked = true;
	}

	makeLetter() {
		if (this.result) this.letter = letterText(this.result);
	}

	dispose() {
		clearTimeout(this.#advance);
		this.#exampleTimers.forEach(clearTimeout);
		for (const file of this.files) if (file.url) URL.revokeObjectURL(file.url);
	}
}

const KEY = Symbol("bill-check");

export function setBillCheck(today: () => Day) {
	return setContext(KEY, new BillCheck(today));
}

export function getBillCheck() {
	return getContext<BillCheck>(KEY);
}
