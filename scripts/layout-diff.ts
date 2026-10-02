/**
 * Phase 10 check: loads each page in the Next app and the SvelteKit app at the
 * same width, scrolls slowly so every lazy image lands, then compares the box
 * of every visible text element. Reports the first element whose position or
 * size drifts by more than 4px, text that exists in only one app, and
 * horizontal page overflow.
 *
 * Pixel screenshots (e2e/parity/visual.parity.ts) also flag image
 * recompression, animation frames and lazy images caught mid-load. This only
 * flags layout.
 *
 *   bun scripts/layout-diff.ts [nextOrigin] [svelteOrigin]
 *   PAGES=/,/preise WIDTHS=375,1200 bun scripts/layout-diff.ts
 *
 * Either origin may be a protected Vercel preview: bun loads
 * VERCEL_AUTOMATION_BYPASS_SECRET from .env.
 *
 * Known, deliberate differences (phase 10 review):
 * - /impressum: "E-Mail: info@…" and "…unter https://ec.europa.eu/… aufrufen"
 *   keep their spaces. JSX dropped them, so Next overflows at 375px.
 * - /funktionen @992: the middle AnimationsSection card uses `h-full` (Next has
 *   the typo `h-ful`), so its title lines up with the first card.
 * - /blog: the tag filters are links (`?tag=`, KI-14), not buttons, so they
 *   show as "only in Next". With 236 posts, the last images may not have loaded
 *   by capture time: Next collapses those to 0px, Svelte reserves their box.
 */
import { chromium } from "@playwright/test";
import { passVercelProtection } from "../e2e/parity/vercelBypass";

const [next = "http://localhost:3000", svelte = "http://localhost:4173"] =
	process.argv.slice(2);
const PAGES = (
	process.env.PAGES ??
	"/,/funktionen,/preise,/geraete,/kontakt,/blog,/blog/wasserzaehler-mit-fernablesung,/impressum,/datenschutzhinweise,/fragebogen"
).split(",");
const WIDTHS = (process.env.WIDTHS ?? "375,768,992,1200,1640")
	.split(",")
	.map(Number);

// The nav link to /messdienstwechsel is new in Svelte; animations would move
// boxes between the two captures.
const NORMALIZE = `a[href="/messdienstwechsel"] { display: none !important; }
* { animation: none !important; transition: none !important; }`;

type Box = { t: string; x: number; y: number; w: number; h: number };

const browser = await chromium.launch();

async function capture(origin: string, path: string, width: number) {
	const page = await browser.newPage({ viewport: { width, height: 900 } });
	await passVercelProtection(page.context(), origin);
	await page.goto(origin + path, { waitUntil: "load" });
	// Next's production build can keep polling, so networkidle may never come.
	const settle = () =>
		page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
	await settle();
	await page.addStyleTag({ content: NORMALIZE });
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 300) {
			window.scrollTo(0, y);
			await new Promise((r) => setTimeout(r, 120));
		}
		window.scrollTo(0, 0);
	});
	await settle();
	const result = await page.evaluate(() => {
		const boxes: Box[] = [];
		const selector =
			"main h1, main h2, main h3, main h4, main p, main li, main button, main label, footer h3, footer p, footer a";
		for (const el of document.querySelectorAll<HTMLElement>(selector)) {
			// Swipers, Lotties and the ticker move on their own.
			if (el.closest(".swiper, [data-lottie], header, .ticker-wrap")) continue;
			const r = el.getBoundingClientRect();
			const t = el.innerText.trim().replace(/\s+/g, " ").slice(0, 50);
			if (!r.width || !r.height || !t) continue;
			boxes.push({
				t,
				x: Math.round(r.x),
				y: Math.round(r.y + window.scrollY),
				w: Math.round(r.width),
				h: Math.round(r.height),
			});
		}
		return {
			boxes,
			height: document.body.scrollHeight,
			overflowX: document.documentElement.scrollWidth > window.innerWidth,
		};
	});
	await page.close();
	return result;
}

let failed = 0;
for (const path of PAGES)
	for (const width of WIDTHS) {
		const [a, b] = await Promise.all([
			capture(next, path, width),
			capture(svelte, path, width),
		]);
		// Match boxes by text, in document order.
		const byText = new Map<string, Box[]>();
		for (const box of b.boxes)
			byText.set(box.t, [...(byText.get(box.t) ?? []), box]);
		const seen = new Map<string, number>();
		const issues: string[] = [];
		let offset = 0; // A shift is reported once, not for everything below it.
		for (const box of a.boxes) {
			const n = seen.get(box.t) ?? 0;
			seen.set(box.t, n + 1);
			const match = byText.get(box.t)?.[n];
			if (!match) {
				issues.push(`only in Next: "${box.t}"`);
				continue;
			}
			const dy = match.y - box.y;
			if (
				Math.abs(match.x - box.x) > 4 ||
				Math.abs(match.w - box.w) > 4 ||
				Math.abs(match.h - box.h) > 4 ||
				Math.abs(dy - offset) > 4
			) {
				issues.push(
					`"${box.t}" Next (${box.x},${box.y} ${box.w}×${box.h}) Svelte (${match.x},${match.y} ${match.w}×${match.h})`,
				);
				offset = dy;
			}
		}
		const nextTexts = new Set(a.boxes.map((box) => box.t));
		for (const box of b.boxes)
			if (!nextTexts.has(box.t)) issues.push(`only in Svelte: "${box.t}"`);
		if (b.overflowX && !a.overflowX)
			issues.push("Svelte overflows horizontally");

		const flags = `${a.overflowX ? " [Next overflows]" : ""}${b.overflowX ? " [Svelte overflows]" : ""}`;
		console.log(
			`${issues.length ? "✘" : "✓"} ${path} @${width}  height ${a.height} → ${b.height}${flags}`,
		);
		for (const issue of issues.slice(0, 8)) console.log(`    ${issue}`);
		if (issues.length) failed++;
	}

await browser.close();
process.exit(failed ? 1 : 0);
