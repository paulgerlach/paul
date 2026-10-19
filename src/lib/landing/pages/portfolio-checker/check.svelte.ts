/**
 * The Portfolio-Checker's state (the design's `#pc-js` file list and run):
 * the chosen or example files with their four status dots, the run, and the
 * result it shows. Per page via context, so the hero's tool and the result
 * section share it. Only a file's name and size are kept: nothing is read,
 * stored or sent. "Today" comes from the page's `DeadlineClock`.
 */
import { getContext, setContext } from "svelte";
import { prefersReducedMotion } from "$lib/landing/motion";
import type { Day } from "$lib/landing/pages/fristenrechner/fristen";
import {
	exampleEvaluation,
	fileKind,
	isAccepted,
	kpis,
	MAX_BYTES,
	type FileKind,
	type Property,
} from "./checker";
import { exampleFiles, tool, type ExampleFile } from "./content";

/** A status dot: waiting, done, running, warning, locked. */
export type Dot = "" | "on" | "run" | "wn" | "lk";
export type Tag = { text: string; tone: "type" | "warn" | "plain" };

let nextId = 0;

export class CheckFile {
	readonly id = nextId++;
	readonly kind: FileKind;
	readonly ok: boolean;
	dots = $state<Dot[]>(["on", "", "", ""]);
	scanning = $state(false);
	tags = $state<Tag[]>([]);

	constructor(
		readonly name: string,
		readonly size: number,
		/** Set for the five example files. */
		readonly example?: ExampleFile,
	) {
		this.kind = example?.kind ?? fileKind(name);
		this.ok = example ? true : isAccepted(name, size);
	}
}

export type Shown =
	| {
			mode: "example";
			properties: Property[];
			kpis: ReturnType<typeof kpis>;
	  }
	| { mode: "own"; files: { name: string; ok: boolean }[] };

export class PortfolioCheck {
	files = $state<CheckFile[]>([]);
	/** What the list holds: nothing yet, the example, or the visitor's files. */
	mode = $state<"" | "example" | "own">("");
	busy = $state(false);
	/** The result section's content, after a run. */
	shown = $state<Shown | null>(null);

	#timers: ReturnType<typeof setTimeout>[] = [];
	#disposed = false;

	constructor(private readonly today: () => Day) {}

	/** Adds picked or dropped files (an example list is replaced); not while running. */
	add(list: Iterable<{ name: string; size: number }>) {
		if (this.busy) return;
		if (this.mode === "example") this.files = [];
		for (const f of list) this.files.push(new CheckFile(f.name, f.size));
		this.mode = "own";
	}

	remove(file: CheckFile) {
		if (this.busy) return;
		this.files = this.files.filter((f) => f !== file);
	}

	/** "Mit Beispielunterlagen testen": the five example files, checked at once. */
	useExamples() {
		if (this.busy) return;
		this.files = exampleFiles.map((f) => new CheckFile(f.name, f.size, f));
		this.mode = "example";
		void this.run();
	}

	/** "Unterlagen prüfen": checks every file in turn, then shows the result. */
	async run() {
		if (this.busy || !this.files.length) return;
		this.busy = true;
		this.shown = null;
		for (const f of this.files) {
			f.scanning = true;
			f.dots[1] = "run";
			await this.#wait(550);
			const ex = f.example;
			if (ex) {
				f.dots[1] = ex.warn ? "wn" : "on";
				f.tags = [
					{ text: ex.type, tone: "type" },
					ex.warn
						? { text: ex.warn, tone: "warn" }
						: { text: ex.ok, tone: "plain" },
				];
				f.dots[2] = "run";
				await this.#wait(450);
				f.dots[2] = "on";
				f.dots[3] = "run";
				await this.#wait(380);
				f.dots[3] = "on";
			} else {
				f.dots[1] = f.ok ? "on" : "wn";
				f.tags = f.ok
					? [
							{
								text: f.kind === "img" ? tool.own.img : tool.own.pdf,
								tone: "type",
							},
							{ text: tool.own.checked, tone: "plain" },
						]
					: [
							{
								text:
									f.size >= MAX_BYTES ? tool.own.tooBig : tool.own.unsupported,
								tone: "warn",
							},
						];
				f.dots[2] = "lk";
				f.dots[3] = "lk";
			}
			f.scanning = false;
			if (this.#disposed) return;
		}
		this.busy = false;
		this.#show();
	}

	#show() {
		if (this.mode === "example") {
			const today = this.today();
			const properties = exampleEvaluation(today);
			this.shown = {
				mode: "example",
				properties,
				kpis: kpis(properties, today, this.files.length),
			};
		} else {
			this.shown = {
				mode: "own",
				files: this.files.map((f) => ({ name: f.name, ok: f.ok })),
			};
		}
	}

	/** The design's `W()`: its waits, none with reduced motion. */
	#wait(ms: number) {
		return new Promise<void>((resolve) => {
			const t = setTimeout(
				() => {
					this.#timers = this.#timers.filter((x) => x !== t);
					if (!this.#disposed) resolve();
				},
				prefersReducedMotion() ? 0 : ms,
			);
			this.#timers.push(t);
		});
	}

	/** Stops a running check (teardown). */
	dispose() {
		this.#disposed = true;
		for (const t of this.#timers) clearTimeout(t);
		this.#timers = [];
	}
}

const KEY = Symbol("portfolio-check");

export function setPortfolioCheck(today: () => Day) {
	return setContext(KEY, new PortfolioCheck(today));
}

export function getPortfolioCheck() {
	return getContext<PortfolioCheck>(KEY);
}
