/**
 * The Zählercheck's state (the design's `S`, `FILES` and its flow): the
 * answers, the files, the current step, its error, the open tooltip, the
 * saved check to resume and the offer's sending. Per page via context, so
 * every visit starts empty and nothing leaks between requests on the server.
 *
 * Files stay in the browser until the offer is made (with a local preview of
 * images, an object URL revoked when the file goes). The answers are kept in
 * `localStorage` to resume; they reach the server only with the offer
 * (`/api/self-service`), which stores them and answers with upload URLs for
 * the files of the drop zones still shown; the browser PUTs each file there
 * once. Sends run one after the other, so "requested" goes after "created"
 * and its uploads, and updates the same stored offer (`ref`).
 */
import { getContext, setContext } from "svelte";
import {
	fileTypeAllowed,
	MAX_FILE_BYTES,
	selfServiceStateSchema,
	type OfferResponse,
} from "$lib/forms/selfServiceOffer";
import { GROUP_DEVS, ORDER, type GroupDev } from "./data";
import {
	fresh,
	makeOffer,
	newGroup,
	nextGroupId,
	num,
	steps,
	validate,
	type State,
	type StepId,
} from "./model";
import { sheet, sheetSlots } from "./sheet";

/** A chosen file: `url` its preview, `path` once uploaded. */
export type Upload = {
	name: string;
	url?: string;
	pdf: boolean;
	file: File;
	type: string;
	path?: string;
};

/** Types some systems leave out (`File.type` empty), by extension. */
const EXT_TYPES: Record<string, string> = {
	pdf: "application/pdf",
	csv: "text/csv",
	xls: "application/vnd.ms-excel",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	heic: "image/heic",
	heif: "image/heif",
	webp: "image/webp",
};
const fileType = (f: File) =>
	f.type || EXT_TYPES[f.name.split(".").pop()?.toLowerCase() ?? ""] || "";

/** Parallel uploads at most. */
const UPLOADS = 3;

const KEY = "heidi_ss_v1";
const ENDPOINT = "/api/self-service";
const START_ENDPOINT = "/api/self-service-start";

export class SelfService {
	s = $state<State>(fresh());
	files = $state<Record<string, Upload[]>>({});
	error = $state("");
	/** Bumped on every move, so the step's block re-enters (`ss-in`). */
	drawId = $state(0);
	/** The open tooltip's id. */
	openTip = $state<string | null>(null);
	/** The explanation is unfolded. */
	infoOpen = $state(false);
	/** A saved check from an earlier visit ("Fortsetzen"). */
	saved = $state<State | null>(null);
	/** The offer request: sending, or failed. */
	sending = $state(false);
	sendFailed = $state(false);
	/** The honeypot field of the contact step (bots fill it). */
	website = $state("");

	list = $derived(steps(this.s));
	id: StepId = $derived(this.list[Math.min(this.s.cur, this.list.length - 1)]);

	/** Called after a move (the component scrolls and focuses). */
	onMove?: (scroll: boolean) => void;
	/** Called when a check points at a group (the component scrolls to it). */
	onProblem?: (group: string) => void;

	#t0 = 0;
	/** The stored offer, from the first send's answer. */
	#ref: OfferResponse["ref"];
	#queue: Promise<unknown> = Promise.resolve();
	#initial = JSON.stringify(fresh());
	#dirty = false;
	/** The first "Weiter" of this visit was reported. */
	#started = false;

	/** In the browser, on mount: the start time and a saved check. */
	restore() {
		this.#t0 = Date.now();
		let old: unknown;
		try {
			const raw = localStorage.getItem(KEY);
			old = raw ? JSON.parse(raw) : null;
		} catch {
			old = null;
		}
		const parsed = selfServiceStateSchema.safeParse(old);
		if (parsed.success && parsed.data.cur > 0 && parsed.data.abr)
			this.saved = parsed.data;
	}

	/** Keeps the answers for "Fortsetzen" (once something was answered). */
	persist(json: string) {
		if (!this.#dirty && json === this.#initial) return;
		this.#dirty = true;
		try {
			localStorage.setItem(KEY, json);
		} catch {
			// Storage blocked: the check works without it.
		}
	}

	#clearSaved() {
		try {
			localStorage.removeItem(KEY);
		} catch {
			// As above.
		}
	}

	count = (id: string) => this.files[id]?.length ?? 0;

	addFiles(id: string, list: FileList | File[], max: number) {
		// Read the list back after creating it: the assignment's value is the
		// plain array, and pushes onto it would bypass the `$state` proxy.
		this.files[id] ??= [];
		const have = this.files[id];
		const skipped: string[] = [];
		for (const f of Array.from(list)) {
			if (have.length >= max) break;
			const type = fileType(f);
			if (!fileTypeAllowed(type) || !f.size || f.size > MAX_FILE_BYTES) {
				skipped.push(f.name);
				continue;
			}
			const image = type.startsWith("image/");
			have.push({
				name: f.name,
				url: image ? URL.createObjectURL(f) : undefined,
				pdf: !image,
				file: f,
				type,
			});
		}
		this.error = skipped.length
			? `Nicht übernommen: ${skipped.join(", ")}. Möglich sind PDF, Fotos und Tabellen bis 20 MB.`
			: "";
	}

	removeFile(id: string, i: number) {
		const [gone] = this.files[id]?.splice(i, 1) ?? [];
		if (gone?.url) URL.revokeObjectURL(gone.url);
	}

	#dropFiles(id: string) {
		for (const f of this.files[id] ?? []) if (f.url) URL.revokeObjectURL(f.url);
		delete this.files[id];
	}

	/** The device types (kept in the design's order, each with a first group). */
	setDevices(devs: string[]) {
		const order: string[] = [...ORDER, "unsicher"];
		this.s.devs = order.filter((k) => devs.includes(k));
		for (const k of this.s.devs) {
			if (!GROUP_DEVS.includes(k as GroupDev)) continue;
			const groups = this.s.groups[k as GroupDev];
			if (!groups.length) groups.push(newGroup(nextGroupId(this.s)));
		}
	}

	addGroup(d: GroupDev) {
		this.s.groups[d].push(newGroup(nextGroupId(this.s)));
	}

	removeGroup(d: GroupDev, id: string) {
		this.s.groups[d] = this.s.groups[d].filter((g) => g.id !== id);
		this.#dropFiles(id);
		this.#dropFiles(`${id}z`);
	}

	#move(scroll = true) {
		this.error = "";
		this.openTip = null;
		this.infoOpen = false;
		this.drawId++;
		if (this.id === "adr") {
			// The billing contact starts as the contact's.
			const { r } = this.s.adr;
			const k = this.s.k;
			if (!r.firma && !r.name) {
				r.firma = k.firma;
				r.name = `${k.vn} ${k.nn}`.trim();
			}
		}
		if (this.id === "ang") this.#makeOffer();
		this.onMove?.(scroll);
	}

	next(skip = false) {
		if (!skip) {
			if (this.id === "dev:rwm") {
				// No total: the minimum from the rooms.
				const r = this.s.rwm;
				const min = num(r.sz) + num(r.kz) + num(r.fl);
				if (!num(r.n) && min) r.n = String(min);
			}
			const problem = validate(this.id, this.s, this.count);
			if (problem) {
				this.error = problem.message;
				if (problem.group) this.onProblem?.(problem.group);
				return;
			}
		}
		if (!this.#started) this.#reportStart();
		this.s.cur = Math.min(this.s.cur + 1, this.list.length - 1);
		this.#move();
	}

	/**
	 * Heidi hears once per visit that a check started: the step left and the
	 * first answer, nothing personal.
	 */
	#reportStart() {
		this.#started = true;
		// keepalive: the request outlives the page if the visitor leaves.
		fetch(START_ENDPOINT, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ step: this.id, bill: this.s.abr }),
			keepalive: true,
		}).catch(() => {});
	}

	back() {
		this.s.cur = Math.max(0, this.s.cur - 1);
		this.#move();
	}

	resume() {
		const old = this.saved;
		if (!old) return;
		this.s = { ...fresh(), ...old };
		this.s.cur = Math.min(this.s.cur, steps(this.s).length - 2);
		this.saved = null;
		this.#move();
	}

	discardSaved() {
		this.#clearSaved();
		this.saved = null;
	}

	restart() {
		for (const id of Object.keys(this.files)) this.#dropFiles(id);
		this.s = fresh();
		this.#ref = undefined;
		this.#clearSaved();
		this.saved = null;
		this.sendFailed = false;
		this.#move();
	}

	/** On the offer step: the offer's number, and Heidi hears of it once. */
	#makeOffer() {
		this.s.ang ??= makeOffer(Date.now(), Math.random());
		if (this.s.ang.noted) return;
		this.s.ang.noted = true;
		void this.#send("created").catch(() => {
			// Heidi hears of it with the request instead.
		});
	}

	/** "Angebot per E-Mail erhalten". */
	async requestOffer() {
		if (this.sending || !this.s.ang) return;
		this.sending = true;
		this.sendFailed = false;
		try {
			await this.#send("requested");
			this.s.ang.sent = true;
			this.onMove?.(true);
		} catch {
			this.sendFailed = true;
		} finally {
			this.sending = false;
		}
	}

	#send(stage: "created" | "requested") {
		const run = this.#queue.then(() => this.#post(stage));
		this.#queue = run.catch(() => {});
		return run;
	}

	async #post(stage: "created" | "requested") {
		const slots = sheetSlots(sheet(this.s));
		const sent = Object.entries(this.files)
			.filter(([id]) => slots.has(id))
			.flatMap(([slot, list]) => list.map((u) => ({ slot, u })));
		const res = await fetch(ENDPOINT, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				stage,
				state: $state.snapshot(this.s),
				ref: this.#ref,
				files: sent.map(({ slot, u }) => ({
					slot,
					// The end keeps the extension.
					name: u.name.slice(-200),
					type: u.type,
					size: u.file.size,
					path: u.path,
				})),
				website: this.website,
				_t: this.#t0,
			}),
		});
		const body = (await res.json().catch(() => ({}))) as Partial<OfferResponse>;
		if (body.ref) this.#ref = body.ref;
		if (body.uploads?.length)
			await this.#upload(
				body.uploads,
				sent.map((x) => x.u),
			);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
	}

	/** PUTs the files; one that fails is sent again with the next send. */
	async #upload(list: NonNullable<OfferResponse["uploads"]>, sent: Upload[]) {
		const todo = [...list];
		const worker = async () => {
			for (let job = todo.shift(); job; job = todo.shift()) {
				const u = sent[job.i];
				if (!u) continue;
				try {
					const res = await fetch(job.url, {
						method: "PUT",
						headers: { "content-type": u.type },
						body: u.file,
					});
					if (res.ok) u.path = job.path;
				} catch {
					// Offline or blocked: retried with the next send.
				}
			}
		};
		await Promise.all(Array.from({ length: UPLOADS }, worker));
	}

	destroy() {
		for (const id of Object.keys(this.files)) this.#dropFiles(id);
	}
}

const CONTEXT = Symbol("self-service");

export const setSelfService = () => setContext(CONTEXT, new SelfService());

export const getSelfService = () => getContext<SelfService>(CONTEXT);
