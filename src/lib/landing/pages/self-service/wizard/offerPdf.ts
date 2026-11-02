/**
 * One offer document as a PDF, the file sales see on the result page and send:
 * the preview's layout (`steps/OfferDoc.svelte`, its `cqw` as `U` here), written
 * directly as a PDF 1.4 like /messdienst-wechseln/muster-kuendigung's, with
 * Helvetica (WinAnsi, not embedded) and JPEGs. Content that doesn't fit moves
 * to a further page, so the page count can exceed the preview's. Pure, but only
 * for the server: it inlines the images.
 */
import logoSource from "$lib/landing/components/icons/HeidiLogo.svelte?raw";
import dashboardJpg from "$lib/assets/landing/self-service/offer-pdf/dashboard.jpg?inline";
import meterJpg from "$lib/assets/landing/self-service/offer-pdf/meter.jpg?inline";
import signatureJpg from "$lib/assets/landing/self-service/offer-pdf/signature.jpg?inline";
import statementJpg from "$lib/assets/landing/self-service/offer-pdf/statement.jpg?inline";
import { winAnsi } from "$lib/landing/pages/muster-kuendigung/helvetica";
import {
	pdfString,
	splitText,
	textWidth,
	type Font,
} from "$lib/landing/pages/muster-kuendigung/pdf";
import { OFFER_COMPANY } from "./data";
import { amount, n2, type Offer, type OfferPart, type State } from "./model";
import { offerDoc, type OfferTable } from "./offerDoc";

const PAGE_W = 595.28; // A4, pt
const PAGE_H = 841.89;
const K = 72 / 25.4; // pt per mm
/** The preview's 1cqw. */
const U = PAGE_W / 100;
const LEFT = 8.5 * U;
const WIDTH = 83 * U;
const RIGHT = LEFT + WIDTH;
const TOP = 6.5 * U;
/** Where content ends: just above the footer. */
const BOTTOM = PAGE_H - 12 * U;

const INK = "#2a2f2d";
const DARK = "#1e322d";
const MUTED = "#5e6b67";
const SAGE = "#7fa088";
const PALE = "#dce8e0";
const LINE = "#eaedeb";
const TILE = "#f1f2f1";
const FOOT = "#3a403e";
const WHITE = "#ffffff";

type ImageKey = "statement" | "dashboard" | "meter" | "signature";
const IMAGES: Record<ImageKey, { src: string; w: number; h: number }> = {
	statement: { src: statementJpg, w: 480, h: 330 },
	dashboard: { src: dashboardJpg, w: 480, h: 255 },
	meter: { src: meterJpg, w: 480, h: 521 },
	signature: { src: signatureJpg, w: 320, h: 232 },
};

/** A character outside WinAnsi: its base letter if it has one (ś → s, Ł → L). */
function plain(text: string) {
	let out = "";
	const swapped = text
		.replace(/₂/g, "2")
		.replace(/Ł/g, "L")
		.replace(/ł/g, "l")
		.replace(/[\t\r\n]+/g, " ");
	for (const char of swapped) {
		if (winAnsi(char) !== undefined) out += char;
		else out += char.normalize("NFD")[0];
	}
	return out;
}

const num = (v: number) => String(Math.round(v * 100) / 100);
const rgb = (hex: string) =>
	[1, 3, 5].map((i) => num(parseInt(hex.slice(i, i + 2), 16) / 255)).join(" ");
const widthOf = (text: string, font: Font, size: number) =>
	textWidth(plain(text), font, size) * K;
const lines = (text: string, width: number, font: Font, size: number) =>
	splitText(plain(text), width / K, font, size);

/** The logo's paths: SVG's M, L, C, Z with absolute coordinates, as PDF. */
function logoPath() {
	const ops: Record<string, string> = { M: "m", L: "l", C: "c", Z: "h" };
	return [...logoSource.matchAll(/\bd="([^"]+)"/g)]
		.map(([, d]) =>
			d
				.trim()
				.split(/\s+/)
				.reduce<string[]>((out, token) => {
					// PDF writes the operator after its numbers.
					if (!ops[token]) out[out.length - 1] += ` ${token}`;
					else out.push(`${ops[token]}|`);
					return out;
				}, [])
				.map((x) => {
					const [op, args] = x.split("|");
					return `${args.trim()} ${op}`.trim();
				})
				.join("\n"),
		)
		.join("\n");
}

/** The pages being drawn; `y` runs down from the page's top, in pt. */
class Canvas {
	pages: string[][] = [];
	y = 0;
	used = new Set<ImageKey>();

	get ops() {
		return this.pages[this.pages.length - 1];
	}

	/** A new page with the logo; `y` below it. */
	page() {
		this.pages.push([]);
		const h = 3.6 * U;
		const a = h / 13;
		this.ops.push(
			`q ${rgb("#2f4f47")} rg ${num(a)} 0 0 ${num(-a)} ${num(RIGHT - 58.6 * a)} ${num(PAGE_H - TOP + 5.3 * a)} cm\n${logoPath()}\nf Q`,
		);
		this.y = TOP + h + 6 * U;
	}

	/** Room for `h` more, or the next page. */
	need(h: number) {
		if (this.y + h > BOTTOM) this.page();
	}

	text(
		x: number,
		y: number,
		text: string,
		size: number,
		font: Font = "regular",
		color = INK,
	) {
		this.ops.push(
			`BT ${rgb(color)} rg /${font === "bold" ? "F2" : "F1"} ${num(size)} Tf ${num(x)} ${num(PAGE_H - y)} Td ${pdfString(plain(text))} Tj ET`,
		);
	}

	textRight(
		right: number,
		y: number,
		text: string,
		size: number,
		font: Font = "regular",
		color = INK,
	) {
		this.text(right - widthOf(text, font, size), y, text, size, font, color);
	}

	/** A rectangle with corners of radius `r`. */
	rect(x: number, y: number, w: number, h: number, color: string, r = 0) {
		const b = PAGE_H - y - h;
		const t = b + h;
		const k = r * 0.5523;
		const path = r
			? [
					`${num(x + r)} ${num(b)} m`,
					`${num(x + w - r)} ${num(b)} l`,
					`${num(x + w - r + k)} ${num(b)} ${num(x + w)} ${num(b + r - k)} ${num(x + w)} ${num(b + r)} c`,
					`${num(x + w)} ${num(t - r)} l`,
					`${num(x + w)} ${num(t - r + k)} ${num(x + w - r + k)} ${num(t)} ${num(x + w - r)} ${num(t)} c`,
					`${num(x + r)} ${num(t)} l`,
					`${num(x + r - k)} ${num(t)} ${num(x)} ${num(t - r + k)} ${num(x)} ${num(t - r)} c`,
					`${num(x)} ${num(b + r)} l`,
					`${num(x)} ${num(b + r - k)} ${num(x + r - k)} ${num(b)} ${num(x + r)} ${num(b)} c h`,
				].join(" ")
			: `${num(x)} ${num(b)} ${num(w)} ${num(h)} re`;
		this.ops.push(`${rgb(color)} rg ${path} f`);
	}

	image(key: ImageKey, x: number, y: number, w: number, h: number) {
		this.used.add(key);
		this.ops.push(
			`q ${num(w)} 0 0 ${num(h)} ${num(x)} ${num(PAGE_H - y - h)} cm /${key} Do Q`,
		);
	}

	/** A paragraph at the cursor, moving to a further page line by line. */
	para(
		text: string,
		size: number,
		opts: {
			font?: Font;
			color?: string;
			x?: number;
			width?: number;
			lh?: number;
		} = {},
	) {
		const { font = "regular", color = INK, x = LEFT, width = RIGHT - x } = opts;
		const lh = size * (opts.lh ?? 1.55);
		for (const line of lines(text, width, font, size)) {
			this.need(lh);
			this.text(x, this.y + size * 1.05, line, size, font, color);
			this.y += lh;
		}
	}
}

function address(c: Canvas, ad: string[], sender: string[]) {
	const size = 1.4 * U;
	const lh = size * 1.75;
	ad.forEach((line, i) => c.text(LEFT, c.y + size + i * lh, line, size));
	sender.forEach((line, i) =>
		c.textRight(RIGHT, c.y + size + i * lh, line, size),
	);
	c.y += Math.max(ad.length, sender.length) * lh;
}

function meta(c: Canvas, property: string[], id: string, date: string) {
	const size = 1.4 * U;
	const lh = size * 1.75;
	c.y += 4.5 * U;
	const second = LEFT + ((WIDTH - 6 * U) * 1.4) / 3.4 + 3 * U;
	c.text(LEFT, c.y + size, "Liegenschaftsadresse", size, "bold");
	property.forEach((line, i) =>
		c.text(LEFT, c.y + size + (i + 1) * lh, line, size),
	);
	c.text(second, c.y + size, "Objekt ID", size, "bold");
	c.text(second, c.y + size + lh, id, size);
	c.textRight(RIGHT, c.y + size, "Angebotsdatum", size, "bold");
	c.textRight(RIGHT, c.y + size + lh, date, size);
	c.y += (property.length + 1) * lh;
}

function heading(c: Canvas, text: string, size: number, before: number) {
	c.y += before;
	c.need(size * 1.4 + 6 * U);
	c.para(text, size, { font: "bold", color: DARK, lh: 1.3 });
}

function table(c: Canvas, t: OfferTable) {
	const size = 1.3 * U;
	const pad = 1.2 * U;
	const padY = 1.7 * U;
	const lh = size * 1.55;

	heading(c, t.title, 2.3 * U, 5 * U);
	c.y += 1 * U;
	c.para(t.kicker, 1.9 * U, { font: "bold", color: SAGE, lh: 1.3 });
	c.y += 1.2 * U;

	// The text column takes what the others leave.
	const cells = t.rows.map((r) => r.map(String));
	const widths = t.cols.map(([head], j) =>
		j
			? Math.max(
					widthOf(head, "bold", size),
					...cells.map((r) => widthOf(r[j], "regular", size)),
				) +
				2 * pad
			: 0,
	);
	widths[0] = WIDTH - widths.reduce((a, b) => a + b, 0);
	const rightEdge = (j: number) =>
		LEFT + widths.slice(0, j + 1).reduce((a, b) => a + b, 0) - pad;

	const head = () => {
		const h = lh + 2 * padY;
		c.rect(LEFT, c.y, WIDTH, h, PALE);
		t.cols.forEach(([label, right], j) => {
			const by = c.y + padY + size * 1.05;
			if (right) c.textRight(rightEdge(j), by, label, size, "bold");
			else {
				const line = lines(label, widths[0] - 2 * pad, "bold", size)[0];
				c.text(LEFT + pad, by, line, size, "bold");
			}
		});
		c.y += h;
	};
	const rule = () => c.rect(LEFT, c.y - 0.5, WIDTH, 0.5, LINE);

	c.need(3 * (lh + 2 * padY));
	head();
	if (t.first) {
		const wrapped = lines(t.first, WIDTH - 2 * pad, "regular", size);
		wrapped.forEach((line, i) =>
			c.text(LEFT + pad, c.y + padY + size * 1.05 + i * lh, line, size),
		);
		c.y += wrapped.length * lh + 2 * padY;
		rule();
	}
	for (const r of cells) {
		const wrapped = lines(r[0], widths[0] - 2 * pad, "regular", size);
		const h = wrapped.length * lh + 2 * padY;
		if (c.y + h > BOTTOM) {
			c.page();
			head();
		}
		wrapped.forEach((line, i) =>
			c.text(LEFT + pad, c.y + padY + size * 1.05 + i * lh, line, size),
		);
		for (let j = 1; j < r.length; j++)
			c.textRight(rightEdge(j), c.y + padY + size * 1.05, r[j], size);
		c.y += h;
		rule();
	}
	const total = (label: string, value: number, bg: string, color: string) => {
		const h = lh + 2 * padY;
		c.need(h);
		c.rect(LEFT, c.y, WIDTH, h, bg);
		const by = c.y + padY + size * 1.05;
		c.text(LEFT + pad, by, label, size, "bold", color);
		c.textRight(RIGHT - pad, by, amount(value), size, "bold", color);
		c.y += h;
	};
	total(t.labelNet, t.totalNet, PALE, INK);
	total(t.labelGross, t.totalGross, SAGE, WHITE);
}

function box(
	c: Canvas,
	label: string,
	value: string,
	note: string,
	bg: string,
	color: string,
) {
	const size = 1.6 * U;
	const small = 1.15 * U;
	const h = 4.4 * U + size * 1.4 + small * 1.5;
	c.need(h);
	c.rect(LEFT, c.y, WIDTH, h, bg, 1 * U);
	const by = c.y + 2.2 * U + size;
	c.text(LEFT + 3 * U, by, label, size, "bold", color);
	c.textRight(RIGHT - 3 * U, by, value, size, "bold", color);
	c.textRight(RIGHT - 3 * U, by + small * 1.6, note, small, "regular", color);
	c.y += h + 0.8 * U;
}

function sub(
	c: Canvas,
	label: string,
	value: string,
	note: string,
	rule: boolean,
) {
	const size = 1.4 * U;
	const small = 1.15 * U;
	const h = 4 * U + size * 1.4 + small * 1.5;
	c.need(h);
	const by = c.y + 2 * U + size;
	c.text(LEFT + 7 * U, by, label, size);
	c.textRight(RIGHT - 3 * U, by, value, size, "bold");
	c.textRight(RIGHT - 3 * U, by + small * 1.6, note, small, "regular", MUTED);
	c.y += h;
	if (rule) c.rect(LEFT, c.y - 0.5, WIDTH, 0.5, LINE);
}

/** The footer's four columns (1 : 1.15 : 1.5 : 1.6) and the page's number. */
function footer(c: Canvas, n: number, of: number) {
	const size = 0.95 * U;
	const lh = size * 1.5;
	const parts = [1, 1.15, 1.5, 1.6];
	const free = WIDTH - 6 * U;
	const unit = free / parts.reduce((a, b) => a + b, 0);
	let x = LEFT;
	const rows = Math.max(...OFFER_COMPANY.footer.map((col) => col.length));
	const top = PAGE_H - 5 * U - rows * lh;
	OFFER_COMPANY.footer.forEach((col, i) => {
		col.forEach((line, j) =>
			c.text(x, top + size + j * lh, line, size, "regular", FOOT),
		);
		x += parts[i] * unit + 2 * U;
	});
	c.textRight(
		RIGHT,
		PAGE_H - 2 * U,
		`Seite ${n} von ${of}`,
		size,
		"regular",
		MUTED,
	);
}

function draw(s: State, offer: Offer, part: OfferPart) {
	const d = offerDoc(s, offer, part);
	const c = new Canvas();
	const size = 1.45 * U;
	const firstHead = () => {
		address(c, d.billing, [
			...OFFER_COMPANY.sender,
			`Angebotsnummer: ${part.nr}`,
		]);
		meta(c, d.property, offer.id, d.dates.date);
	};
	const small = (text: string, font: Font = "regular") => {
		c.y += 2.4 * U;
		c.para(text, 1.35 * U, { font });
	};

	// Page 1: the letter's start and the three features.
	c.page();
	firstHead();
	c.y += 6 * U;
	c.para(d.heading, 2.9 * U, { font: "bold", color: DARK, lh: 1.3 });
	c.y += 2.4 * U;
	c.para(d.intro.join(""), size);
	for (const f of d.features) {
		// Smaller than the preview's 24cqw, whose page simply grows: all three
		// fit on the first page here.
		const tile = 18 * U;
		const x = LEFT + tile + 4.5 * U;
		const width = RIGHT - x;
		c.y += 3 * U;
		c.need(tile);
		const top = c.y;
		c.rect(LEFT, top, tile, tile, TILE, 1.6 * U);
		const image = IMAGES[f.img];
		const room = tile - 3.2 * U;
		const scale = Math.min(room / image.w, room / image.h);
		const [w, h] = [image.w * scale, image.h * scale];
		c.image(f.img, LEFT + (tile - w) / 2, top + (tile - h) / 2, w, h);
		c.para(f.h, 1.9 * U, { font: "bold", color: DARK, x, width, lh: 1.3 });
		c.y += 0.6 * U;
		c.para(f.p, 1.4 * U, { x, width });
		c.y += 1.2 * U;
		for (const b of f.b) {
			const bullet = 2.2 * U;
			c.text(x + bullet, c.y + 1.4 * U * 1.05, "•", 1.4 * U);
			c.para(b, 1.4 * U, { x: x + 2 * bullet, width: width - 2 * bullet });
		}
		c.y = Math.max(c.y, top + tile);
	}

	// Page 2: the overview, the closing and the signature.
	c.page();
	firstHead();
	c.y += 10 * U;
	c.para(d.overview, 2.9 * U, { font: "bold", color: DARK, lh: 1.3 });
	c.y += 4 * U;
	if (!d.abr) box(c, d.onceLabel, `${n2(d.p.sO)} €`, d.exVat, PALE, DARK);
	box(c, d.yearLabel, `${n2(d.p.year)} €`, d.exVat, SAGE, WHITE);
	sub(c, d.serviceLabel, `${n2(d.p.sS)} €`, d.exVat, !d.abr);
	if (!d.abr) sub(c, d.deviceLabel, d.deviceValue, d.exVat, false);
	c.y += 2.4 * U;
	c.para(d.separate, size, { color: MUTED });
	if (d.requested) {
		c.y += 2.4 * U;
		c.para(d.requested, size, { color: MUTED });
	}
	c.y += 2.4 * U;
	for (const line of d.closing) c.para(line, size);
	c.y += 5 * U;
	const sign = IMAGES.signature;
	const signW = 11 * U;
	const signH = (signW * sign.h) / sign.w;
	c.need(size * 1.55 * 2 + signH + 2 * U);
	c.para(d.greeting, size);
	c.y += 1.5 * U;
	c.image("signature", LEFT, c.y, signW, signH);
	c.y += signH + 0.5 * U;
	c.para(OFFER_COMPANY.signatory, size);

	// Page 3 and on: the tables, the terms and what's still checked.
	c.page();
	table(c, d.yearly);
	if (d.abr) for (const t of d.terms) small(t);
	else {
		table(c, d.rental);
		c.page();
		table(c, d.once);
		for (const t of d.terms) small(t);
		if (d.selfMounted) small(d.selfMounted);
		if (d.checks.length) {
			small(d.checksIntro, "bold");
			c.y += 1 * U;
			for (const x of d.checks) {
				c.need(1.35 * U * 1.55);
				c.text(LEFT + 2 * U, c.y + 1.35 * U * 1.05, "•", 1.35 * U);
				c.para(x, 1.35 * U, { x: LEFT + 4 * U });
			}
		}
	}

	// The footers last: only now is the page count known.
	c.pages.forEach((ops, i) => {
		const page = new Canvas();
		page.pages.push(ops);
		footer(page, i + 1, c.pages.length);
	});
	return c;
}

/** The data URL's bytes as a binary string. */
const jpegBytes = (src: string) => atob(src.slice(src.indexOf(",") + 1));

/** The PDF bytes of one offer document. */
export function offerPdf(s: State, offer: Offer, part: OfferPart) {
	const c = draw(s, offer, part);
	const images = [...c.used];
	// 1 catalog, 2 pages, 3–4 fonts, 5 info, the images, then a page and its
	// content each.
	const firstImage = 6;
	const firstPage = firstImage + images.length;
	const pageIds = c.pages.map((_, i) => firstPage + i * 2);
	const objects: string[] = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${c.pages.length} >>`,
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
		`<< /Title ${pdfString(plain(`Angebot ${part.title} ${part.nr}`))} /Producer (Heidi Systems) >>`,
	];
	for (const key of images) {
		const { src, w, h } = IMAGES[key];
		const data = jpegBytes(src);
		objects.push(
			`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${data.length} >>\nstream\n${data}\nendstream`,
		);
	}
	const xObjects = images
		.map((key, i) => `/${key} ${firstImage + i} 0 R`)
		.join(" ");
	for (const [i, ops] of c.pages.entries()) {
		const content = ops.join("\n");
		objects.push(
			`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << ${xObjects} >> >> /Contents ${pageIds[i] + 1} 0 R >>`,
			`<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
		);
	}

	// Every character below is one byte (ASCII, the comment and the JPEGs).
	let out = "%PDF-1.4\n%âãÏÓ\n";
	const offsets: number[] = [];
	for (const [i, body] of objects.entries()) {
		offsets.push(out.length);
		out += `${i + 1} 0 obj\n${body}\nendobj\n`;
	}
	const xref = out.length;
	out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	for (const offset of offsets)
		out += `${String(offset).padStart(10, "0")} 00000 n \n`;
	out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

	const bytes = new Uint8Array(out.length);
	for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
	return bytes;
}
