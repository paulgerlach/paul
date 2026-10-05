/**
 * Converts a saved landing page design ("Heidi <Stadt>" artifact HTML) into
 * the content modules of the region template (plan: new-landing-page-plan,
 * phases 7.4 and 8).
 *
 *   bun scripts/extract-city.ts <design.html> <slug>
 *   bun scripts/extract-city.ts <design.html> --germany
 *
 * City output:
 *   src/lib/landing/pages/messdienstanbieter-city/cities/<slug>.ts      copy, example property, FAQ
 *   src/lib/landing/pages/messdienstanbieter-city/cities/<slug>-map.ts  districts, labels, hints
 *   src/lib/assets/landing/cities/<slug>/{hero,references}.jpg          the embedded photos
 * Germany output:
 *   src/lib/landing/pages/messdienstanbieter/{content,germany-map}.ts
 *   src/lib/assets/landing/germany/{hero,references}.jpg
 *
 * The script is strict: every element it reads must be found exactly as
 * often as expected, otherwise it stops with the selector's name, so a design
 * that changed structure isn't imported half-right. The `seo` and `links`
 * blocks are written by hand; on a re-run they are kept from the existing
 * module (new modules get TODO values that fail the type check).
 *
 * Uses Bun's built-in HTMLRewriter, so there's no parser dependency.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { $ } from "bun";

const ROOT = join(import.meta.dir, "..");
const CITY_DIR = join(
	ROOT,
	"src/lib/landing/pages/messdienstanbieter-city/cities",
);
const GERMANY_DIR = join(ROOT, "src/lib/landing/pages/messdienstanbieter");

/** City names of the design footers → slugs (umlauts → ae/oe/ue). */
export const SLUGS: Record<string, string> = {
	Berlin: "berlin",
	München: "muenchen",
	Hamburg: "hamburg",
	Köln: "koeln",
	Frankfurt: "frankfurt",
	Düsseldorf: "duesseldorf",
	Stuttgart: "stuttgart",
	Leipzig: "leipzig",
	Dortmund: "dortmund",
	Bremen: "bremen",
	Essen: "essen",
	Dresden: "dresden",
	Nürnberg: "nuernberg",
	Hannover: "hannover",
	Duisburg: "duisburg",
	Bochum: "bochum",
	Wuppertal: "wuppertal",
	Bielefeld: "bielefeld",
	Bonn: "bonn",
	Münster: "muenster",
	Mannheim: "mannheim",
	Karlsruhe: "karlsruhe",
	Augsburg: "augsburg",
	Wiesbaden: "wiesbaden",
	Mönchengladbach: "moenchengladbach",
};

/** `alt` of the logo strip images → keys of `customerLogos`. */
const LOGO_KEYS: Record<string, string> = {
	Berlin: "berlin",
	Dumax: "dumax",
	"Harte Hausverwaltung": "harte",
	HSP: "hsp",
	raumgold: "raumgold",
	Schleicher: "schleicher",
	Vitec: "vitec",
	Wagner: "wagner",
	"Werne Immobilien": "werne",
	"Neckar Immobilienverwaltung": "neckar",
	Niesen: "niesen",
	"Pro Gera Immobilien": "progera",
	"Landeshauptstadt München": "lhm",
};

/* ---------------------------------------------------------------- reading */

type Match = { attrs: Record<string, string>; text: string; children: Match[] };

function fail(message: string): never {
	console.error(`✗ ${message}`);
	process.exit(1);
}

const ENTITIES: Record<string, string> = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
	shy: "­",
};
const decode = (s: string) =>
	s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
		if (e[0] === "#")
			return String.fromCodePoint(
				e[1] === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10),
			);
		return ENTITIES[e] ?? m;
	});
const clean = (s: string) => decode(s).replace(/\s+/g, " ").trim();

/**
 * All elements matching `selector`, in document order, with their attributes
 * and text (descendants included). With `child`, the matches of
 * `selector child` are collected under their parent.
 */
async function select(html: string, selector: string, child?: string) {
	const out: Match[] = [];
	let cur: Match | undefined;
	let rw = new HTMLRewriter().on(selector, {
		element(el) {
			cur = {
				attrs: Object.fromEntries(el.attributes),
				text: "",
				children: [],
			};
			out.push(cur);
		},
		text(t) {
			if (cur) cur.text += t.text;
		},
	});
	if (child) {
		let sub: Match | undefined;
		rw = rw.on(`${selector} ${child}`, {
			element(el) {
				sub = {
					attrs: Object.fromEntries(el.attributes),
					text: "",
					children: [],
				};
				cur?.children.push(sub);
			},
			text(t) {
				if (sub) sub.text += t.text;
			},
		});
	}
	await rw.transform(new Response(html)).text();
	for (const m of out) {
		m.text = clean(m.text);
		for (const c of m.children) c.text = clean(c.text);
	}
	return out;
}

async function all(html: string, selector: string, count: number) {
	const found = await select(html, selector);
	if (found.length !== count)
		fail(`"${selector}" matched ${found.length}×, expected ${count}×`);
	return found;
}
const one = async (html: string, selector: string) =>
	(await all(html, selector, 1))[0];
const text = async (html: string, selector: string) =>
	(await one(html, selector)).text;
const texts = async (html: string, selector: string, count: number) =>
	(await all(html, selector, count)).map((m) => m.text);

function expectEqual(what: string, actual: string, expected: string) {
	if (actual !== expected)
		fail(`${what}: "${actual}" doesn't match the expected "${expected}"`);
}

function writeDataUri(uri: string, file: string) {
	const m = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/.exec(uri);
	if (!m) fail(`unexpected image data in ${file}: ${uri.slice(0, 40)}`);
	mkdirSync(dirname(file), { recursive: true });
	const bytes = Buffer.from(m[2], "base64");
	writeFileSync(file, bytes);
	return bytes.length;
}

/* -------------------------------------------------------------------- map */

type Label = {
	x: number;
	y: number;
	lines: string[];
	lineHeight?: number;
	small?: boolean;
	fontSize?: number;
};

const num = (s: string | undefined, what: string) => {
	const n = Number(s);
	if (s === undefined || Number.isNaN(n)) fail(`${what}: not a number (${s})`);
	return n;
};

const fontSizeOf = (style: string | undefined) => {
	const m = /font-size:\s*([\d.]+)px/.exec(style ?? "");
	return m ? Number(m[1]) : undefined;
};

/** "Friedrichshain-" + "Kreuzberg" → "Friedrichshain-Kreuzberg", "Berg am" + "Laim" → "Berg am Laim" */
const joinLines = (lines: string[]) =>
	lines.reduce(
		(acc, l) => (!acc ? l : acc.endsWith("-") ? acc + l : `${acc} ${l}`),
		"",
	);

async function readMap(html: string) {
	const svg = await one(html, ".bm-map svg");
	const shapes = [...(await select(html, "g.bz-g .bz"))];
	const outline = await select(html, "g.bz-g path.bz-out");
	if (outline.length > 1) fail(`"path.bz-out" matched ${outline.length}×`);
	const labelEls = await select(html, "g.bz-l text", "tspan");
	const marker = await all(html, "g.bz-m circle", 2);

	// Labels follow the order of their shapes; the dot labels (`.dl`) and the
	// polygon labels each in their own sequence. Not every shape has one (the
	// city-states on the Germany map), and labels may be abbreviated
	// ("Ludwigsv.-", "NRW"), so they're matched by order with a loose check.
	type Pending = { label: Label; dot: boolean; key: string };
	const pending: Pending[] = labelEls.map((t) => {
		const lines = t.children.length ? t.children.map((c) => c.text) : [t.text];
		const dys = t.children.slice(1).map((c) => Number(c.attrs.dy));
		const label: Label = {
			x: num(t.attrs.x, "label x"),
			y: num(t.attrs.y, "label y"),
			lines,
		};
		if (dys.length) {
			if (new Set(dys).size > 1)
				fail(`label "${lines}" has mixed line heights`);
			label.lineHeight = dys[0];
		}
		if (/\bsm\b/.test(t.attrs.class ?? "")) label.small = true;
		const size = fontSizeOf(t.attrs.style);
		if (size) label.fontSize = size;
		return {
			label,
			dot: /\bdl\b/.test(t.attrs.class ?? ""),
			key: joinLines(lines).trim(),
		};
	});
	const bz = /var BZ=(\{.*?\});\n/s.exec(html);
	if (!bz) fail("map data (var BZ) not found");
	const hints: Record<string, { t: string; h: string }> = JSON.parse(bz[1]);
	const pick = /pick\((["'])([^"']+)\1\);/.exec(html);
	if (!pick) fail("default district (pick(…)) not found");

	const css = [...html.matchAll(/<style[^>]*>(.*?)<\/style>/gs)]
		.map((m) => m[1])
		.join("\n");
	const strokeWidth = Number(/\.bz\{[^}]*stroke-width:([\d.]+)/.exec(css)?.[1]);
	const labelSize = Number(/\.bz-l\{[^}]*font-size:([\d.]+)px/.exec(css)?.[1]);

	const queues = {
		dot: pending.filter((p) => p.dot),
		path: pending.filter((p) => !p.dot),
	};
	const districts = shapes.map((s) => {
		const name = s.attrs["data-n"];
		if (!name) fail("a map shape has no data-n");
		const data = hints[name];
		if (!data) fail(`no BZ entry for district "${name}"`);
		const isDot = (s.attrs.class ?? "").split(" ").includes("dot");
		const queue = isDot ? queues.dot : queues.path;
		const label =
			queue[0] && labelMatches(name.trim(), queue[0].key)
				? queue.shift()!.label
				: undefined;
		return {
			name,
			href: s.attrs["data-href"],
			shape: isDot
				? {
						kind: "dot" as const,
						cx: num(s.attrs.cx, "cx"),
						cy: num(s.attrs.cy, "cy"),
						r: num(s.attrs.r, "r"),
					}
				: { kind: "path" as const, d: s.attrs.d },
			label,
			stock: data.t,
			hint: data.h,
		};
	});
	const left = [...queues.dot, ...queues.path];
	if (left.length)
		fail(
			`map labels without a shape: ${left.map((p) => `"${p.key}"`).join(", ")}`,
		);
	const unlabelled = districts
		.filter((d) => !d.label)
		.map((d) => d.name.trim());
	if (unlabelled.length)
		console.log(`  map shapes without a label: ${unlabelled.join(", ")}`);
	if (Object.keys(hints).length !== districts.length)
		fail(
			`${Object.keys(hints).length} BZ entries for ${districts.length} districts`,
		);
	if (!districts.some((d) => d.name === pick[2]))
		fail(`default district "${pick[2]}" isn't on the map`);

	const mx = num(marker[1].attrs.cx, "marker cx");
	const my = num(marker[1].attrs.cy, "marker cy");
	return {
		ariaLabel: svg.attrs["aria-label"],
		viewBox: svg.attrs.viewbox, // HTMLRewriter lowercases attribute names
		outline: outline[0]?.attrs.d,
		areaLabel: (await all(html, ".bm-info .bm-k", 2))[0].text,
		districts,
		defaultDistrict: pick[2],
		// The Germany design parks its unused marker off the map.
		marker: mx < 0 && my < 0 ? undefined : { x: mx, y: my },
		style: {
			...(strokeWidth !== 2 && { strokeWidth }),
			...(labelSize !== 11 && { labelSize }),
			...(!/\.bm-map svg\{max-height:600px\}/.test(css) && {
				legacyFrame: /\.bm-map\{padding-bottom:46px\}/.test(css)
					? ("narrow" as const)
					: ("none" as const),
			}),
		},
	};
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
/** Abbreviations the designs use for a label. */
const LABEL_ALIASES: Record<string, string> = { NRW: "Nordrhein-Westfalen" };

/** Loose check that a (possibly abbreviated) label belongs to a shape. */
function labelMatches(name: string, label: string) {
	if (LABEL_ALIASES[label] === name) return true;
	const numbered = /^Stadtbezirk (\d+)$/.exec(name); // Düsseldorf: "2 · Flingern/Düsseltal"
	if (numbered) return label.startsWith(`${numbered[1]} `);
	const n = norm(name);
	const l = norm(label);
	return l.slice(0, 3) === n.slice(0, 3);
}

/* ---------------------------------------------------------------- content */

async function readContent(html: string) {
	const name = /<title>Heidi ([^<]+)<\/title>/.exec(html)?.[1];
	if (!name) fail("<title>Heidi …</title> not found");

	const banner = await text(html, ".banner");
	expectEqual("banner link", await text(html, ".banner a"), "Mehr erfahren");
	const bannerText = banner.replace(/\s*Mehr erfahren$/, "");

	const heroImg = await one(html, ".hero-photo img");
	const hpTitles = await texts(html, ".hp-card .t", 3);
	const hpSubs = await texts(html, ".hp-card .s", 3);
	const heroUnits = /^(\d+) WE$/.exec(await text(html, ".hp-card .r"));
	if (!heroUnits) fail('hero card units ("24 WE") not found');
	const address = hpTitles[0];

	const logoAlts = (await select(html, ".logo-row img")).map(
		(m) => m.attrs.alt,
	);
	if (logoAlts.length !== 12)
		fail(`logo strip has ${logoAlts.length} logos, expected 12`);
	const logos = logoAlts.map((alt) => {
		const key = LOGO_KEYS[alt];
		if (!key)
			fail(
				`unknown customer logo "${alt}": add it to customerLogos and LOGO_KEYS`,
			);
		return key;
	});

	// AllInOne: appointment, units, avatars, and the lines built from them
	const appt = (await text(html, ".ai-card.c1 .ai-vis .t")).split(" · ");
	if (appt.length !== 2) fail('appointment isn\'t "<day> · <time>"');
	const [day, time] = appt;
	expectEqual(
		"appointment mail",
		await text(html, ".ai-card.c2 .mail"),
		`Ihr Montagetermin: ${day}, ${time}`,
	);
	const counts = (await all(html, ".ai-card [data-cnt]", 3)).map(
		(m) => m.attrs["data-cnt"],
	);
	const units = num(counts[0], "units");
	expectEqual("unit count in card 2", counts[1], String(units));
	expectEqual("unit count in card 4", counts[2], "24");
	expectEqual(
		"card 1 counter",
		await text(html, ".ai-card.c1 .cnt"),
		`${units} von ${units} Einheiten montiert`,
	);
	const avs = await texts(html, ".ai-card.c2 .avs i", 4);
	expectEqual("last avatar", avs[3], "+");
	expectEqual(
		"billing line of card 4",
		await text(html, ".ai-card.c4 .ai-vis > .s"),
		`Heizkostenabrechnung 2026 · ${address}`,
	);

	// Visuals that repeat the example property
	expectEqual("billing card", await text(html, ".hk-h .t"), address);
	expectEqual("phone", await text(html, ".ph-acc b"), address);
	expectEqual(
		"portfolio title",
		await text(html, ".bw-t"),
		`Portfolio ${name}`,
	);
	const tabs = await texts(html, ".bw-tabs button", 3);
	expectEqual("portfolio tab 2", tabs[1], address);
	const secondAddress = tabs[2];
	const rowSubs = await texts(html, ".bw-tbl tbody[data-v=all] small", 2);
	expectEqual("portfolio row 1", rowSubs[0], `${address} · 24 Einheiten`);
	expectEqual("portfolio row 2", rowSubs[1], `${secondAddress} · 18 Einheiten`);
	const flow = await texts(html, ".t3 .t-box b", 2);
	expectEqual("trio flow", flow[0], address);
	expectEqual(
		"trio tenants",
		(await texts(html, ".t3 .t-box small", 2))[0],
		`${units} Mietparteien`,
	);
	const legend = await text(html, ".bm-legend");

	const faq = await select(html, "section.faq details", ".ans");
	if (faq.length !== 5) fail(`FAQ has ${faq.length} items, expected 5`);
	const faqItems = faq.map((d) => {
		const answer = d.children[0]?.text;
		if (!answer) fail("FAQ item without .ans");
		return {
			question: d.text.slice(0, d.text.length - answer.length).trim(),
			answer,
		};
	});
	for (const item of faqItems)
		if (/^Nein\b/.test(item.answer) && !/^Müssen\b/.test(item.question))
			console.warn(
				`⚠ FAQ answer starts with "Nein" but the question doesn't ask "Müssen …": "${item.question}"`,
			);
	// The pricing answer links to the price page (README, internal links).
	const pricing = faqItems[4];
	if (!/kost|zahl|rechnet|Preis/i.test(pricing.question))
		console.warn(
			`⚠ 5th FAQ question doesn't look like the pricing one: "${pricing.question}"`,
		);
	if (!pricing.answer.includes("Angebot"))
		fail('pricing answer has no "Angebot" to link');
	pricing.answer = pricing.answer.replace(
		"Angebot",
		'<a href="/preise">Angebot</a>',
	);

	const refBg = await one(html, "img.ref-bg");
	const svcHead = await select(html, "section.city-svc .shead", undefined);
	if (svcHead.length !== 1) fail("section.city-svc .shead");

	return {
		name,
		images: { hero: heroImg.attrs.src, references: refBg.attrs.src },
		content: {
			name,
			bannerText,
			hero: {
				tag: await text(html, ".city-tag"),
				title: await text(html, "header.city-hero h1"),
				lede: await text(html, "header.city-hero .lede"),
				checks: await texts(html, "header.city-hero .easy li", 3),
				photoAlt: heroImg.attrs.alt,
				units: Number(heroUnits[1]),
			},
			example: {
				address,
				area: hpSubs[0],
				units,
				secondAddress,
				appointment: { day, time },
				avatars: avs.slice(0, 3),
				tenant: await text(html, ".t3 .t-av"),
			},
			logoStrip: { text: await text(html, "section.logos p"), logos },
			noWait: {
				eyebrow: await text(html, "section.nowait .eyebrow"),
				title: await text(html, "section.nowait h2"),
				text: await text(html, "section.nowait .shead p"),
				notes: await texts(html, ".tl-note > span", 3),
			},
			allInOne: {
				eyebrow: await text(html, "section.allin .eyebrow"),
				title: await text(html, "section.allin h2"),
				text: await text(html, "section.allin .shead p"),
				cards: await texts(html, ".ai-card > p", 4),
			},
			map: {
				eyebrow: await text(html, "section.bmap .eyebrow"),
				title: await text(html, "section.bmap h2"),
				sub: await text(html, ".bm-sub"),
				legend,
			},
			billing: {
				title: await text(html, "section.knopf h2"),
				text: await text(html, "section.knopf .sub"),
				checks: await texts(html, "section.knopf li", 3),
			},
			service: {
				eyebrow: await text(html, "section.city-svc .eyebrow"),
				title: await text(html, "section.city-svc h2"),
				text: await text(html, "section.city-svc .shead p"),
				kpis: await texts(html, ".kpi > span", 3),
			},
			duo: await (async () => {
				const h = await texts(html, ".duo-card h3", 2);
				const p = await texts(html, ".duo-card > p", 2);
				return {
					uvi: { title: h[0], text: p[0] },
					portfolio: { title: h[1], text: p[1] },
				};
			})(),
			trio: await texts(html, ".trio-grid > div > p", 3),
			faq: faqItems,
			final: {
				title: await text(html, "section.final h2"),
				sub: await text(html, "section.final .final-sub"),
			},
		},
	};
}

/* ----------------------------------------------------------------- output */

/** JS literal with soft hyphens kept visible as escapes. */
const lit = (v: unknown) =>
	JSON.stringify(v, null, "\t").replace(/­/g, "\\u00ad");

/** Carries the hand-written `seo` and `links` blocks over from an existing module. */
function keptBlocks(file: string, isGermany: boolean) {
	const fallback = {
		seo: "seo: TODO_SEO,",
		links: isGermany ? "links: { nearby: [] }," : "links: TODO_LINKS,",
	};
	if (!existsSync(file)) return fallback;
	const src = readFileSync(file, "utf8");
	const block = (key: string) => {
		const start = src.indexOf(`\t${key}: `);
		if (start < 0) return undefined;
		// Up to the line that closes it at the same indent
		const rest = src.slice(start);
		const end = rest.search(/\n\t[a-zA-Z]+: |\n\};?\n/);
		return rest.slice(1, end).trimEnd();
	};
	return {
		seo: block("seo") ?? fallback.seo,
		links: block("links") ?? fallback.links,
	};
}

async function format(files: string[]) {
	await $`bunx prettier --write ${files}`.cwd(ROOT).quiet();
}

/* ------------------------------------------------------------------ main */

const [input, target] = process.argv.slice(2);
if (!input || !target) {
	console.error(
		"usage: bun scripts/extract-city.ts <design.html> <slug>|--germany",
	);
	process.exit(1);
}
const html = readFileSync(input, "utf8");
const isGermany = target === "--germany";
const { name, images, content } = await readContent(html);
const map = await readMap(html);

if (!isGermany && SLUGS[name] !== target)
	fail(`the design is "${name}", but the slug is "${target}"`);
if (isGermany && name !== "Deutschland")
	fail(`the design is "${name}", not Deutschland`);

const slug = isGermany ? undefined : target;
const assetDir = isGermany
	? join(ROOT, "src/lib/assets/landing/germany")
	: join(ROOT, `src/lib/assets/landing/cities/${slug}`);
const assetImport = isGermany
	? "$lib/assets/landing/germany"
	: `$lib/assets/landing/cities/${slug}`;
const heroBytes = writeDataUri(images.hero, join(assetDir, "hero.jpg"));
const refBytes = writeDataUri(
	images.references,
	join(assetDir, "references.jpg"),
);

const contentFile = isGermany
	? join(GERMANY_DIR, "content.ts")
	: join(CITY_DIR, `${slug}.ts`);
const mapFile = isGermany
	? join(GERMANY_DIR, "germany-map.ts")
	: join(CITY_DIR, `${slug}-map.ts`);
// Germany: map.ts builds the map from germany-map.ts and the live cities.
const mapModule = isGermany ? "./map" : `./${slug}-map`;
const kept = keptBlocks(contentFile, isGermany);

// Section order, with the imports and the map module spliced in
const { map: mapCopy, ...c } = content;
const body = lit({
	name: c.name,
	bannerText: c.bannerText,
	hero: { ...c.hero, photo: "@@heroPhoto@@" },
	example: c.example,
	logoStrip: c.logoStrip,
	noWait: c.noWait,
	allInOne: c.allInOne,
	map: { "@@...map@@": 0, ...mapCopy },
	billing: c.billing,
	service: c.service,
	duo: c.duo,
	trio: c.trio,
	referencesPhoto: "@@referencesPhoto@@",
	faq: c.faq,
	final: c.final,
})
	.replace(/"@@heroPhoto@@"/, "heroPhoto")
	.replace(/"@@referencesPhoto@@"/, "referencesPhoto")
	.replace(/"@@\.\.\.map@@": 0/, "...map")
	.replace(/^\{\n/, "")
	.replace(/\n\}$/, "");

writeFileSync(
	contentFile,
	`// Generated by scripts/extract-city.ts from the "Heidi ${name}" design.
// Edit the design and re-run the script; only \`seo\` and \`links\` are hand-written.
import heroPhoto from "${assetImport}/hero.jpg?enhanced";
import referencesPhoto from "${assetImport}/references.jpg?enhanced";
import type { RegionContent } from "$lib/landing/sections/region/types";
import map from "${mapModule}";

const content: RegionContent = {
${slug ? `\tslug: ${lit(slug)},\n` : ""}\t${kept.seo}
\t${kept.links}
${body},
};

export default content;
`,
);

if (isGermany) {
	writeGermanyMap(mapFile, map);
} else {
	writeFileSync(
		mapFile,
		`// Generated by scripts/extract-city.ts from the "Heidi ${name}" design.
import type { MapGeometry } from "$lib/landing/sections/region/types";

const map: MapGeometry = ${lit({
			...map,
			// City designs have no links on their maps
			districts: map.districts.map((d) => ({ ...d, href: undefined })),
			...(Object.keys(map.style).length ? {} : { style: undefined }),
		})};

export default map;
`,
	);
}

/**
 * Germany: the 16 states are districts; the city dots are stored by slug and
 * turned into links for the live cities at runtime (plan 8.3). State hints
 * that list city pages ("Eigene Seiten: …") are generated from the live
 * cities too, so only the suffix after that sentence is kept here.
 */
function writeGermanyMap(file: string, m: Awaited<ReturnType<typeof readMap>>) {
	const states = m.districts.filter((d) => d.shape.kind === "path");
	const dots = m.districts.filter((d) => d.shape.kind === "dot");
	const cityDots = Object.fromEntries(
		dots.map((d) => {
			const city = d.name.trim();
			const slug = SLUGS[city];
			if (!slug) fail(`unknown city dot "${city}"`);
			if (d.shape.kind !== "dot") throw new Error();
			const { cx, cy, r } = d.shape;
			return [
				slug,
				{ cx, cy, r, label: d.label && { ...d.label, lines: [city] } },
			];
		}),
	);
	const stateData = states.map((s) => {
		const listed = /^Eigene Seiten?: [^.]+\.\s*(.*)$/.exec(s.hint);
		const { stock, hint, ...geo } = s;
		return listed
			? { ...geo, stock, cityHint: { suffix: listed[1] || undefined } }
			: { ...geo, stock, hint };
	});
	writeFileSync(
		file,
		`// Generated by scripts/extract-city.ts from the "Heidi Deutschland" design.
// \`cityHint\` states get their hint from the live cities in them
// (germanyMap() in ./map.ts); FALLBACK_HINTS are used while a state has none.
import type { GermanyMapData } from "./map";

const data: GermanyMapData = ${lit({
			ariaLabel: m.ariaLabel,
			viewBox: m.viewBox,
			areaLabel: m.areaLabel,
			defaultDistrict: m.defaultDistrict,
			style: Object.keys(m.style).length ? m.style : undefined,
			states: stateData,
			cityDots,
		})};

export default data;
`,
	);
}

await format([contentFile, mapFile]);

const kinds = new Set(map.districts.map((d) => d.shape.kind));
console.log(
	`✓ ${name}: ${map.districts.length} districts (${map.outline ? "outline + " : ""}${[...kinds].join(" + ")}), default "${map.defaultDistrict}", ` +
		`hero ${Math.round(heroBytes / 1024)} KB, references ${Math.round(refBytes / 1024)} KB, ` +
		`logos ${content.logoStrip.logos.join(",")}`,
);
if (kept.seo.includes("TODO") || kept.links.includes("TODO"))
	console.log("  → write seo and links by hand (TODO_SEO / TODO_LINKS)");
