<!--
  "DocuScan" (.ds-g): the text beside the demo (.ds, example data), where an
  invoice drops in, a beam scans it and the four fields fill in one by one,
  typed, with their lines on the invoice highlighted; then "In die Abrechnung
  übernommen", or the stamp "Nicht relevant" for the painter's invoice. The
  server renders the first invoice done (the design's reduced-motion state);
  with motion the four invoices take turns while 35 % of the demo is in view
  (`loopInView`, one 5.7 s pass each, as the design's `#fk-js`).
  "Zur Heizkostenabrechnung" leads to /heizkostenabrechnung.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import IconPaths from "../components/IconPaths.svelte";
	import Icon from "../components/Icon.svelte";
	import Section from "../components/Section.svelte";
	import { docuscan } from "../content";

	const { invoices } = docuscan;
	/** Each field's lines on the invoice: the design's `[0,1,3,5]` / `[2,2,4,5]`. */
	const FIELD_LINES = [
		[0, 2],
		[1, 2],
		[3, 4],
		[5, 5],
	];
	const LINES = ["90%", "70%", "82%", "60%", "40%", "52%"];
	const FIELD_AT = 900;
	const FIELD_STEP = 480;
	const DONE_AT = FIELD_AT + 4 * FIELD_STEP + 250;
	const PASS = FIELD_AT + 4 * FIELD_STEP + 2900;

	/** Off until the first pass: the server's static end state. */
	let loop = $state(false);
	let index = $state(0);
	/** Bumped per pass, to replay the invoice's drop. */
	let pass = $state(0);
	let scan = $state(false);
	/** The field being read, or -1. */
	let field = $state(-1);
	let typed = $state(invoices[0].fields.map((f) => f.value));
	let typing = $state([false, false, false, false]);
	let lit = $state<number[]>([]);
	let done = $state(true);
	let next = 0;

	const invoice = $derived(invoices[index]);
	const skipped = $derived(done && !!invoice.skip);

	const type = (k: number, text: string) => {
		let n = 0;
		typed[k] = "";
		typing[k] = true;
		const step = Math.max(1, Math.ceil(text.length / 14));
		const timer = setInterval(() => {
			n += step;
			typed[k] = text.slice(0, n);
			if (n >= text.length) {
				typing[k] = false;
				clearInterval(timer);
			}
		}, 28);
		return timer;
	};

	const run = () => {
		const i = next;
		next = (next + 1) % invoices.length;
		const d = invoices[i];
		loop = true;
		index = i;
		pass++;
		scan = false;
		field = -1;
		lit = [];
		done = false;
		typed = d.fields.map(() => "");
		typing = d.fields.map(() => false);

		const timers: ReturnType<typeof setTimeout>[] = [];
		const intervals: ReturnType<typeof setInterval>[] = [];
		const later = (fn: () => void, ms: number) =>
			timers.push(setTimeout(fn, ms));
		later(() => (scan = true), 500);
		d.fields.forEach((f, k) =>
			later(
				() => {
					field = k;
					lit = [...lit, ...FIELD_LINES[k]];
					intervals.push(type(k, f.value));
				},
				FIELD_AT + k * FIELD_STEP,
			),
		);
		later(() => {
			field = -1;
			done = true;
		}, DONE_AT);
		return () => {
			timers.forEach(clearTimeout);
			intervals.forEach(clearInterval);
		};
	};
</script>

<Section alt labelledby="fk-docuscan-h">
	<div class="ds-g">
		<div>
			<SectionHead
				id="fk-docuscan-h"
				eyebrow={docuscan.eyebrow}
				heading={docuscan.h2}
			>
				{#snippet icon()}<IconPaths name={docuscan.eyebrowIcon} />{/snippet}
			</SectionHead>
			<p class="ds-p rv">{docuscan.text}</p>
			<a class="ghost rv" href={docuscan.link.href}
				>{docuscan.link.text} <span class="ar" aria-hidden="true">→</span></a
			>
		</div>

		<!-- `rv` on a wrapper: the class list below changes while revealing. -->
		<div class="rv">
			<div
				class={["ds", loop && "loop"]}
				role="img"
				aria-label={docuscan.label}
				{@attach loopInView({ run, every: PASS, threshold: 0.35 })}
			>
				<div class="ds-dw">
					{#key pass}
						<div
							class={[
								"ds-doc",
								loop && "drop",
								scan && "scan",
								skipped && "skip",
							]}
						>
							<b class="ds-dt">{invoice.title}</b>
							<small>{invoice.supplier}</small>
							{#each LINES.slice(0, 3) as w, l (l)}
								<i class={["ln", lit.includes(l) && "hl"]} style:--w={w}></i>
							{/each}
							<div class="ds-tb">
								{#each LINES.slice(3) as w, l (l)}
									<i class={["ln", lit.includes(l + 3) && "hl"]} style:--w={w}
									></i>
								{/each}
							</div>
							<b class="ds-sum">{invoice.sum}</b>
							<i class="ds-beam"></i>
							<span class="ds-stamp">{docuscan.stamp}</span>
						</div>
					{/key}
					<div class="ds-q">
						{#each invoices as invoiceDot, q (invoiceDot)}<i
								class={[q === index && "on"]}
							></i>{/each}
						<span>{docuscan.counter(index + 1, invoices.length)}</span>
					</div>
				</div>

				<div class="ds-out">
					<div class="ds-oh">
						<Icon name="file" /><b>{docuscan.found}</b>
						<span class="tag">{docuscan.tag}</span>
					</div>
					{#each invoice.fields as f, k (k)}
						<div class={["ds-f", field === k && "on"]}>
							<small>{f.label}</small>
							<b
								>{typed[k]}{#if typing[k]}<span class="ds-cur"></span>{/if}</b
							>
						</div>
					{/each}
					<div class={["ds-ok", done && "on", skipped && "skip"]}>
						{#if invoice.skip}
							<svg viewBox="0 0 20 20" aria-hidden="true"
								><path
									d="M6 6l8 8M14 6l-8 8"
									stroke="#fff"
									stroke-width="2.2"
									stroke-linecap="round"
									fill="none"
								/></svg
							>
							{docuscan.skipped}
						{:else}
							<svg viewBox="0 0 12 10" width="10" aria-hidden="true"
								><path
									d="M1 5l3.5 3.5L11 1"
									stroke="#1E322D"
									stroke-width="2"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
							{docuscan.ok}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</Section>

<style>
	.ds-g {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(32px, 5vw, 72px);
		align-items: center;
	}
	.ds-p {
		color: var(--muted);
		font-size: 17px;
		line-height: 1.6;
		margin: 16px 0 22px;
		max-width: 44ch;
	}
	/* .pg-ghost: "Zur Heizkostenabrechnung" */
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	.ds {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
		gap: 18px;
		align-items: center;
	}
	.ds-dw {
		min-width: 0;
	}
	.ds-doc {
		position: relative;
		overflow: hidden;
		background: #fff;
		border-radius: 14px;
		padding: 24px;
		box-shadow: 0 30px 60px -38px rgba(30, 50, 45, 0.5);
		min-height: 340px;
	}
	.ds-dt {
		display: block;
		font-size: 18px;
		font-weight: 600;
	}
	.ds-doc small {
		font-size: 13px;
		color: var(--muted);
	}
	.ln {
		display: block;
		height: 8px;
		border-radius: 4px;
		background: #eef1ef;
		width: var(--w);
		margin-top: 13px;
		transition: background 0.35s;
	}
	.ln.hl {
		background: #cdebd0;
	}
	.ds-doc.skip .ln.hl {
		background: #f6d8cb;
	}
	.ds-tb {
		margin-top: 24px;
		padding-top: 8px;
		border-top: 1px solid #eef1ef;
	}
	.ds-sum {
		position: absolute;
		right: 24px;
		bottom: 24px;
		font-size: 17px;
		font-weight: 600;
	}
	.ds-beam {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 2px;
		background: var(--accent);
		box-shadow: 0 0 16px 4px rgba(138, 214, 143, 0.45);
		opacity: 0;
	}
	.ds-doc.scan .ds-beam {
		animation: dsb 1.5s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
	@keyframes dsb {
		0% {
			opacity: 1;
			transform: translateY(0);
		}
		90% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(340px);
		}
	}
	.ds-doc.drop {
		animation: dsin 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes dsin {
		0% {
			opacity: 0;
			transform: translate(-18px, 10px) rotate(-2.5deg);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	.ds-stamp {
		position: absolute;
		left: 50%;
		top: 46%;
		transform: translate(-50%, -50%) rotate(-12deg) scale(1.4);
		border: 2.5px solid #d9622b;
		color: #d9622b;
		border-radius: 8px;
		padding: 7px 16px;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.02em;
		white-space: nowrap;
		background: rgba(255, 255, 255, 0.85);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.3s,
			transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.ds-doc.skip .ds-stamp {
		opacity: 1;
		transform: translate(-50%, -50%) rotate(-12deg) scale(1);
	}
	.ds-q {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 14px;
		padding-left: 4px;
		font-size: 13px;
		color: var(--muted);
	}
	.ds-q i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #d6ddd9;
		transition:
			background 0.3s,
			transform 0.3s;
	}
	.ds-q i.on {
		background: var(--ink);
		transform: scale(1.25);
	}
	.ds-q span {
		margin-left: 6px;
	}
	.ds-out {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 17px;
		padding: 17px;
	}
	.ds-oh {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-bottom: 10px;
		border-bottom: 1px solid #eef1ef;
	}
	.ds-oh :global(svg) {
		width: 16px;
		height: 16px;
	}
	.ds-oh b {
		font-size: 15px;
	}
	.tag {
		margin-left: auto;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 9px;
	}
	.ds-f {
		padding: 11px 3px;
		border-bottom: 1px solid #f1f4f2;
	}
	.ds-f small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.ds-f b {
		font-size: 15px;
		font-weight: 600;
	}
	.ds-ok {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
		font-size: 13.5px;
		font-weight: 600;
		color: #2f7a3c;
	}
	.ds-ok svg {
		width: 22px;
		height: 22px;
		padding: 4px;
		border-radius: 50%;
		background: var(--accent);
	}
	/* The loop (the design's `.ds.loop`). */
	.loop .ds-f {
		transition: background 0.3s;
	}
	.loop .ds-f b {
		display: block;
		min-height: 1.4em;
	}
	.loop .ds-f.on {
		background: linear-gradient(
			90deg,
			rgba(138, 214, 143, 0.18),
			rgba(138, 214, 143, 0)
		);
		border-radius: 8px;
	}
	.loop .ds-ok {
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	.loop .ds-ok.on {
		opacity: 1;
		transform: none;
	}
	.loop .ds-ok.on svg {
		animation: dsp 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	@keyframes dsp {
		0% {
			transform: scale(0.5);
		}
		100% {
			transform: none;
		}
	}
	.loop .ds-ok.skip {
		color: #b4432b;
	}
	.loop .ds-ok.skip svg {
		background: #d9622b;
	}
	.ds-cur {
		display: inline-block;
		width: 2px;
		height: 1em;
		background: var(--ink);
		margin-left: 2px;
		vertical-align: -2px;
		animation: dsc 0.6s steps(2) infinite;
	}
	@keyframes dsc {
		50% {
			opacity: 0;
		}
	}
	@media (max-width: 980px) {
		.ds-g {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 560px) {
		.ds {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ds * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
