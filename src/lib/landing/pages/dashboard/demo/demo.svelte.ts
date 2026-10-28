/**
 * The dashboard preview's state (plan 03, 3A.1): one instance per page,
 * shared with the preview's components through context. Everything the
 * visitor does here stays in this object: nothing is sent anywhere.
 */
import { getContext, setContext } from "svelte";
import type { Granularity } from "../chart";
import {
	type BillingFunction,
	type DemoDocument,
	type DemoObject,
	type DocCategory,
	DOCUMENTS,
	METERS,
	type MeterType,
	OBJECTS,
	type PeriodKey,
	PERIODS,
	type SeriesKey,
	TODAY,
} from "./data";
import {
	type ChartState,
	co2,
	perObject,
	scopeObject,
	typeCounts,
} from "./model";

export type View = "dash" | "obj" | "mtr" | "doc" | "abr";
export type Menu = "port" | "zeit" | "share" | "acc";
export type TileKey = SeriesKey | "prog";
export type Drawer =
	{ kind: "alert"; type: MeterType } | { kind: "meter"; id: string } | null;

export class DashboardDemo {
	view = $state<View>("dash");
	scope = $state<string | null>(null);
	periodKey = $state<PeriodKey>("ytd");
	granularity = $state<Granularity>("m");
	dataView = $state(false);
	previousYear = $state({ kalt: false, warm: false });
	meterType = $state<"all" | MeterType>("all");
	meterQuery = $state("");
	objectQuery = $state("");
	docCategory = $state<"all" | DocCategory>("all");
	billingFunction = $state<BillingFunction>("hk");
	objects = $state<DemoObject[]>(OBJECTS.map((o) => ({ ...o })));
	documents = $state<DemoDocument[]>(DOCUMENTS.map((d) => ({ ...d })));
	invited = $state<string[]>([]);
	added = $state<{ rm: [string, string][]; fl: [string, string][] }>({
		rm: [],
		fl: [],
	});
	docsUnseen = $state(false);
	openMenu = $state<Menu | null>(null);
	drawer = $state<Drawer>(null);
	dialogTile = $state<TileKey | null>(null);
	note = $state<{ text: string; id: number } | null>(null);
	/** Bumped when the charts should play their draw-in again. */
	drawId = $state(0);

	readonly meters = METERS;

	period = $derived(PERIODS.find((p) => p.key === this.periodKey)!);
	chartState: ChartState = $derived({
		scope: this.scope,
		period: this.period,
		granularity: this.granularity,
		objects: this.objects,
	});
	scoped = $derived(scopeObject(this));
	counts = $derived(typeCounts(this.objects, this.scope));
	co2 = $derived(co2(this.chartState));
	perObject = $derived(perObject(this.chartState));
	totalUnits = $derived(this.objects.reduce((s, o) => s + o.units, 0));

	#noteTimer: ReturnType<typeof setTimeout> | undefined;
	#noteId = 0;

	setScope(id: string | null) {
		this.scope = id;
		this.openMenu = null;
		this.view = "dash";
		this.drawId++;
	}

	setPeriod(key: PeriodKey) {
		this.periodKey = key;
		this.openMenu = null;
		this.drawId++;
	}

	setGranularity(g: Granularity) {
		this.granularity = g;
		this.drawId++;
	}

	go(view: View) {
		this.view = view;
		this.openMenu = null;
		if (view === "doc") this.docsUnseen = false;
	}

	toggleMenu(menu: Menu) {
		this.openMenu = this.openMenu === menu ? null : menu;
	}

	notify(text: string) {
		clearTimeout(this.#noteTimer);
		this.note = { text, id: ++this.#noteId };
		this.#noteTimer = setTimeout(() => (this.note = null), 2600);
	}

	addObject(name: string, units: number) {
		const id = `x${this.objects.length + 1}`;
		this.objects.push({ id, name, units, radio: 0, delta: 0, isNew: true });
		this.notify(`${name} angelegt (Vorschau)`);
	}

	invite(email: string) {
		this.invited.unshift(email);
		this.notify(`Einladung an ${email} vorbereitet (Vorschau)`);
	}

	addDocument(doc: Omit<DemoDocument, "date" | "isNew">) {
		this.documents.unshift({ ...doc, date: TODAY, isNew: true });
		this.docsUnseen = true;
	}

	/** Where focus goes back to when the drawer or the dialog closes. */
	#trigger: HTMLElement | null = null;

	openAlert(type: MeterType, trigger: HTMLElement) {
		this.#trigger = trigger;
		this.dialogTile = null;
		this.drawer = { kind: "alert", type };
	}

	openMeter(id: string, trigger?: HTMLElement) {
		if (trigger) this.#trigger = trigger;
		this.dialogTile = null;
		this.drawer = { kind: "meter", id };
	}

	openTile(key: TileKey, trigger: HTMLElement) {
		this.#trigger = trigger;
		this.drawer = null;
		this.dialogTile = key;
	}

	/** Closes the dialog or the drawer and returns focus to what opened it. */
	closeLayer() {
		this.dialogTile = null;
		this.drawer = null;
		const trigger = this.#trigger;
		this.#trigger = null;
		if (trigger?.isConnected) trigger.focus();
	}

	objectName(id: string): string {
		return this.objects.find((o) => o.id === id)?.name ?? "";
	}

	destroy() {
		clearTimeout(this.#noteTimer);
	}
}

const KEY = Symbol("dashboard-demo");

export function setDemo(demo: DashboardDemo): DashboardDemo {
	return setContext(KEY, demo);
}

export function getDemo(): DashboardDemo {
	return getContext<DashboardDemo>(KEY);
}
