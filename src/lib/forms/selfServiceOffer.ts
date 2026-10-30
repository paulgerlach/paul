import { z } from "zod";
import type { State } from "$lib/landing/pages/self-service/wizard/model";
import type { Sheet } from "$lib/landing/pages/self-service/wizard/sheet";

/**
 * The Zählercheck's state on /self-service: checked when the wizard resumes a
 * saved check from `localStorage` and again by `/api/self-service`, which
 * stores it with the offer. Every field is a raw form value;
 * missing ones default to empty, so an older saved check still parses.
 */
const text = (max = 200) => z.string().max(max).default("");
const note = text(2000);
const list = z.array(z.string().max(40)).max(20).default([]);

const group = z.object({
	id: z.string().regex(/^g\d{1,4}$/),
	n: text(10),
	inst: text(),
	funk: text(),
	her: text(),
	mod: text(),
	jahr: text(),
	std: text(),
	key: text(),
	einbau: text(),
	ksys: text(),
	ksysx: text(),
	wtyp: text(),
	fg: text(),
	art: text(),
	was: text(),
	fuehler: text(),
	absv: text(),
	bem: note,
	bl: text(),
	blx: text(),
	dn: text(),
	dnx: text(),
	gew: text(),
	gewx: text(),
	qp: text(),
	qpx: text(),
	q3: text(),
	q3x: text(),
});
const groups = z.array(group).max(30).default([]);

export const selfServiceStateSchema = z.object({
	abr: text(),
	abrNote: note,
	liste: text(),
	listeNote: note,
	bestand: text(),
	pref: text(),
	devs: list,
	heiz: list,
	ww: text(),
	leist: text(),
	kauf: text(),
	units: text(10),
	groups: z
		.object({
			kwz: groups,
			wwz: groups,
			wmz: groups,
			hkv: groups,
			weitere: groups,
		})
		.default({ kwz: [], wwz: [], wmz: [], hkv: [], weitere: [] }),
	rwm: z
		.object({
			n: text(10),
			mont: list,
			sz: text(10),
			kz: text(10),
			fl: text(10),
			art: text(),
			bem: note,
		})
		.default({ n: "", mont: [], sz: "", kz: "", fl: "", art: "", bem: "" }),
	mont: z
		.object({
			abs: text(),
			eat: text(),
			err: text(),
			wer: text(),
			san: text(),
			bem: note,
		})
		.default({ abs: "", eat: "", err: "", wer: "eigen", san: "", bem: "" }),
	zusatz: list,
	k: z.object({
		vn: text(),
		nn: text(),
		firma: text(),
		mail: text(254),
		tel: text(60),
		ok: z.boolean().default(false),
	}),
	adr: z.object({
		l: z.object({
			str: text(),
			zus: text(),
			plz: text(10),
			ort: text(),
			hin: note,
		}),
		same: z.boolean().default(true),
		r: z.object({
			firma: text(),
			name: text(),
			str: text(),
			zus: text(),
			plz: text(10),
			ort: text(),
			ust: text(40),
		}),
	}),
	ang: z
		.object({
			id: z.string().regex(/^\d{6}$/),
			nr: z.string().regex(/^\d{4}-AN\d{6}$/),
			ts: z.number(),
			noted: z.boolean().optional(),
			sent: z.boolean().optional(),
		})
		.nullable()
		.default(null),
	cur: z.number().int().min(0).max(100).default(0),
}) satisfies z.ZodType<State, unknown>;

/** The files the bucket `self-service` takes (its migration has the same). */
export const FILE_TYPES = [
	"application/pdf",
	"image/*",
	"text/csv",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_FILES = 100;

export const fileTypeAllowed = (type: string) =>
	FILE_TYPES.some((t) =>
		t.endsWith("/*") ? type.startsWith(t.slice(0, -1)) : type === t,
	);

/** A file of the offer; `path` once the server signed its upload. */
const offerFile = z.object({
	/** The drop zone: `abr`, `liste`, a group (`g1`) or its meter (`g1z`). */
	slot: z.string().regex(/^(abr|liste|g\d{1,4}z?)$/),
	name: z.string().min(1).max(200),
	type: z.string().max(120).refine(fileTypeAllowed),
	size: z.number().int().min(1).max(MAX_FILE_BYTES),
	path: z.string().max(200).optional(),
});

/** A result's random parts: 22 of [A-Za-z0-9] (131 bits). */
export const SECRET = /^[A-Za-z0-9]{22}$/;

/** What `/api/self-service` receives. */
export const selfServiceOfferSchema = z.object({
	/** `created`: the offer was made; `requested`: send it by email. */
	stage: z.enum(["created", "requested"]),
	state: selfServiceStateSchema,
	/** The stored offer to update (from the first answer), if any. */
	ref: z.object({ id: z.uuid(), key: z.string().regex(SECRET) }).optional(),
	/** The files still chosen; their content goes to the upload URLs. */
	files: z.array(offerFile).max(MAX_FILES),
	website: z.string().optional(),
	_t: z.number().optional(),
});

export type OfferFile = z.infer<typeof offerFile>;

/** What `/api/self-service` answers on success. */
export type OfferResponse = {
	success: true;
	ref?: { id: string; key: string };
	/** Upload URLs for the request's files at `i` that had no `path`. */
	uploads?: { i: number; path: string; url: string }[];
};

/** A stored file (`path` in the bucket `self-service`). */
export type StoredFile = Required<OfferFile>;

/** `self_service_results.data`. */
export type SelfServiceRecord = {
	version: 1;
	stage: "created" | "requested";
	/** The questions as asked and the answers (`sheet.ts`). */
	sheet: Sheet;
	/** The raw state, for a later look at what the sheet doesn't show. */
	state: State;
	files: StoredFile[];
	/** Make.com has heard of the offer (it's told once). */
	notified?: boolean;
};
