import { z } from "zod";
import type { State } from "$lib/landing/pages/self-service/wizard/model";

/**
 * The Zählercheck's state on /self-service: checked when the wizard resumes a
 * saved check from `localStorage` and again by `/api/self-service`, which
 * builds the offer's notification from it. Every field is a raw form value;
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

/** What `/api/self-service` receives. */
export const selfServiceOfferSchema = z.object({
	/** `created`: the offer was made; `requested`: send it by email. */
	stage: z.enum(["created", "requested"]),
	state: selfServiceStateSchema,
	/** Photos and documents chosen, which stay in the browser. */
	files: z.number().int().min(0).max(500),
	website: z.string().optional(),
	_t: z.number().optional(),
});
