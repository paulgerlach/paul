<!--
  The Zählercheck (`#check`, the design's `.ss-wiz` and `#ss-js`): the
  progress bar, the current step with its explanation and "Bisher erfasst"
  beside it, "Weiter" / "Überspringen" / "zurück", and the resume bar for a
  check saved in this browser. The steps live in `wizard/steps/`, the state
  in `wizard/wizard.svelte.ts`, the math in `wizard/model.ts`.

  The design's wizard styles are here, for every step (`:global` under
  `.ss-wiz`); the offer preview has its own. Without JS the check can't run
  and the section is hidden (`@media (scripting: none)`).
-->
<script lang="ts">
	import Markup from "../wizard/ui/Markup.svelte";
	import { onMount, tick, untrack } from "svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { deviceStep, SENT_LEAD, STEPS, type GroupDev } from "../wizard/data";
	import { devOf, isOptional, liveRows } from "../wizard/model";
	import Abr from "../wizard/steps/Abr.svelte";
	import Adr from "../wizard/steps/Adr.svelte";
	import Bestand from "../wizard/steps/Bestand.svelte";
	import Device from "../wizard/steps/Device.svelte";
	import Einheiten from "../wizard/steps/Einheiten.svelte";
	import Geraete from "../wizard/steps/Geraete.svelte";
	import Heiz from "../wizard/steps/Heiz.svelte";
	import Kontakt from "../wizard/steps/Kontakt.svelte";
	import Liste from "../wizard/steps/Liste.svelte";
	import Mont from "../wizard/steps/Mont.svelte";
	import Offer from "../wizard/steps/Offer.svelte";
	import Result from "../wizard/steps/Result.svelte";
	import Rwm from "../wizard/steps/Rwm.svelte";
	import Zusatz from "../wizard/steps/Zusatz.svelte";
	import { setSelfService } from "../wizard/wizard.svelte";

	const w = setSelfService();
	let wiz: HTMLDivElement;
	let heading = $state<HTMLHeadingElement>();

	const id = $derived(w.id);
	const dev = $derived(devOf(id));
	const text = $derived(
		dev ? deviceStep(dev) : STEPS[id as keyof typeof STEPS],
	);
	const sent = $derived(id === "ang" && Boolean(w.s.ang?.sent));
	const title = $derived(sent ? `Vielen Dank, ${w.s.k.vn}.` : text.title);
	const lead = $derived(
		id === "res"
			? `Vielen Dank, ${w.s.k.vn}. ${text.lead}`
			: sent
				? SENT_LEAD
				: text.lead,
	);
	const go = $derived(
		(
			{
				kontakt: "Geräteliste und Kostenvoranschlag",
				res: "Weiter zu Liegenschafts- und Rechnungsadresse",
				adr: "Angebot erstellen",
			} as Record<string, string>
		)[id] ?? "Weiter",
	);
	const live = $derived(
		["res", "adr", "ang"].includes(id) ? [] : liveRows(w.s, w.count("liste")),
	);

	onMount(() => {
		w.restore();
		return () => w.destroy();
	});

	$effect(() => {
		const json = JSON.stringify(w.s);
		untrack(() => w.persist(json));
	});

	const motion = () => (prefersReducedMotion() ? "auto" : "smooth");

	w.onMove = async (scroll) => {
		await tick();
		if (!scroll) return;
		const top = wiz.getBoundingClientRect().top;
		if (top < 0 || top > window.innerHeight * 0.5)
			window.scrollTo({ top: window.scrollY + top - 80, behavior: motion() });
		setTimeout(
			() => heading?.focus({ preventScroll: true }),
			prefersReducedMotion() ? 0 : 350,
		);
	};
	w.onProblem = async (group) => {
		await tick();
		wiz
			.querySelector(`[data-g="${group}"]`)
			?.scrollIntoView({ behavior: motion(), block: "center" });
	};

	/** Any answer clears the step's error (the design's `hideErr`). */
	function answered(e: Event) {
		if (e.type !== "click" || (e.target as Element).closest("button"))
			w.error = "";
	}

	function toggleInfo() {
		w.infoOpen = !w.infoOpen;
	}
</script>

<svelte:document
	onclick={(e) => {
		const t = e.target as Element;
		if (w.openTip && !t.closest?.(".ss-tipb, .ss-qm")) w.openTip = null;
	}}
	onkeydown={(e) => {
		if (e.key === "Escape") w.openTip = null;
	}}
/>

<section class="pg-sec alt ss-check" id="check" aria-labelledby="ss-t">
	<div class="wrap">
		<div class="ss-wiz" bind:this={wiz}>
			{#if w.saved}
				<div class="ss-resume">
					<span>Sie haben bereits einen Zählercheck begonnen.</span>
					<span
						><button type="button" onclick={() => w.resume()}>Fortsetzen</button
						>
						·
						<button type="button" onclick={() => w.discardSaved()}
							>Neu beginnen</button
						></span
					>
				</div>
			{/if}
			<div class="ss-top">
				<div class="ss-prog" aria-hidden="true">
					{#each w.list.slice(0, -1) as step, i (step)}
						<i class={[i < w.s.cur && "done", i === w.s.cur && "cur"]}></i>
					{/each}
				</div>
				<span class="ss-stepn"
					>{id === "ang"
						? "Abgeschlossen"
						: `Schritt ${w.s.cur + 1} von ${w.list.length - 1}`}</span
				>
			</div>
			<div class="ss-grid">
				{#key w.drawId}
					<div class="ss-main anim">
						{#if w.s.cur > 0}
							<button type="button" class="ss-back" onclick={() => w.back()}
								>‹ zurück</button
							>
						{/if}
						<h2 class="ss-t" id="ss-t" tabindex="-1" bind:this={heading}>
							{title}
						</h2>
						<p class="ss-lead">{lead}</p>
						<div
							class="ss-body"
							oninput={answered}
							onchange={answered}
							onclick={answered}
							role="presentation"
						>
							{#if id === "abr"}<Abr />
							{:else if id === "liste"}<Liste />
							{:else if id === "bestand"}<Bestand />
							{:else if id === "geraete"}<Geraete />
							{:else if id === "heiz"}<Heiz />
							{:else if id === "einheiten"}<Einheiten />
							{:else if dev === "rwm"}<Rwm />
							{:else if dev}<Device d={dev as GroupDev} />
							{:else if id === "mont"}<Mont />
							{:else if id === "zusatz"}<Zusatz />
							{:else if id === "kontakt"}<Kontakt />
							{:else if id === "res"}<Result />
							{:else if id === "adr"}<Adr />
							{:else if id === "ang"}<Offer />
							{/if}
						</div>
						<p class="f-err" role="alert">{w.error}</p>
						{#if id !== "ang"}
							<div class="ss-act">
								<button
									type="button"
									class="bk-next ss-go"
									onclick={() => w.next()}
									>{go} <span class="ar" aria-hidden="true">→</span></button
								>
								{#if isOptional(id)}
									<button
										type="button"
										class="ss-skip"
										onclick={() => w.next(true)}>Überspringen</button
									>
								{/if}
							</div>
						{/if}
					</div>
				{/key}
				<aside class="ss-aside">
					<div
						class={["ss-info", !w.infoOpen && "fold"]}
						role="button"
						tabindex="0"
						aria-expanded={w.infoOpen}
						onclick={toggleInfo}
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								toggleInfo();
							}
						}}
					>
						<p class="ss-info-k"><span class="ss-i">i</span>Erklärung</p>
						<div class="ss-info-b"><Markup html={text.info} /></div>
					</div>
					{#if live.length}
						<div class="ss-live">
							<p class="ss-info-k">Bisher erfasst</p>
							<div>
								{#each live as [label, value] (label)}
									<div class="ss-live-r">
										<span>{label}</span><b>{value}</b>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</aside>
			</div>
		</div>
	</div>
</section>

<style>
	/* Global: the step blocks are other components. */
	@keyframes -global-ss-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes -global-ss-flash {
		0% {
			box-shadow: 0 0 0 0 rgba(138, 214, 143, 0.7);
		}
		100% {
			box-shadow: 0 0 0 10px rgba(138, 214, 143, 0);
		}
	}
	@keyframes -global-ss-hvpop {
		0% {
			transform: scale(0.6);
			opacity: 0;
		}
		100% {
			transform: none;
			opacity: 1;
		}
	}
	@keyframes -global-ms-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes -global-ssck {
		to {
			stroke-dashoffset: 0;
		}
	}
	.ss-check {
		scroll-margin-top: 70px;
	}
	.ss-wiz {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 26px;
		padding: clamp(20px, 3vw, 40px);
		box-shadow: 0 40px 80px -50px rgba(30, 50, 45, 0.35);
	}
	@media (scripting: none) {
		.ss-check {
			display: none;
		}
	}

	.ss-wiz :global {
		/* Frame, progress and step */
		.ss-top {
			display: flex;
			align-items: center;
			gap: 16px;
		}
		.ss-prog {
			display: flex;
			gap: 6px;
			flex: 1;
			max-width: 620px;
		}
		.ss-prog i {
			flex: 1;
			height: 4px;
			border-radius: 2px;
			background: #e6eae8;
			overflow: hidden;
			position: relative;
		}
		.ss-prog i::after {
			content: "";
			position: absolute;
			inset: 0;
			background: var(--accent-deep);
			transform: scaleX(0);
			transform-origin: left;
			transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
		}
		.ss-prog i.done::after {
			transform: none;
		}
		.ss-prog i.cur::after {
			transform: scaleX(0.5);
			background: var(--accent);
		}
		.ss-stepn {
			font-size: 13px;
			color: var(--faint);
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
		}
		.ss-grid {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
			gap: clamp(24px, 4vw, 56px);
			margin-top: 28px;
			align-items: start;
		}
		.ss-main {
			min-width: 0;
		}
		.ss-main.anim {
			animation: ss-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
		}
		.ss-back {
			border: 0;
			background: none;
			font-size: 14px;
			color: var(--faint);
			cursor: pointer;
			padding: 0;
			margin-bottom: 10px;
		}
		.ss-back:hover {
			color: var(--ink);
		}
		h2.ss-t {
			font-size: clamp(28px, 3.2vw, 42px);
			font-weight: 500;
			letter-spacing: -0.035em;
			line-height: 1.08;
			margin: 0;
			outline: 0;
		}
		.ss-lead {
			color: var(--muted);
			font-size: 17px;
			line-height: 1.55;
			margin: 12px 0 0;
			max-width: 60ch;
		}
		.ss-body {
			margin-top: 26px;
		}
		.ss-act {
			display: flex;
			align-items: center;
			gap: 18px;
			margin-top: 26px;
			flex-wrap: wrap;
		}
		.ss-skip {
			border: 0;
			background: none;
			font-size: 15px;
			font-weight: 600;
			color: #2f7a3c;
			cursor: pointer;
			padding: 6px 0;
		}
		.ss-skip:hover {
			text-decoration: underline;
			text-underline-offset: 4px;
		}
		.f-err {
			color: var(--orange);
			font-size: 13px;
			font-weight: 500;
			margin: 10px 0 0;
		}

		/* .bk-next (#demo-css) and .pg-ghost (#pg-common-css) */
		.bk-next {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			width: 100%;
			margin-top: 18px;
			border: 0;
			background: var(--ink);
			color: #fff;
			font-size: 15.5px;
			font-weight: 600;
			border-radius: 11px;
			padding: 14px 18px;
			cursor: pointer;
			transition:
				background 0.2s,
				transform 0.15s,
				opacity 0.2s;
		}
		.bk-next:hover:not(:disabled) {
			background: #2a443d;
		}
		.bk-next:active:not(:disabled) {
			transform: scale(0.98);
		}
		.bk-next:disabled {
			opacity: 0.35;
			cursor: not-allowed;
		}
		.bk-next .ar {
			transition: transform 0.25s;
		}
		.bk-next:hover .ar {
			transform: translateX(4px);
		}
		.bk-next.ss-go {
			width: auto;
			margin-top: 0;
			padding: 14px 24px;
		}
		.pg-ghost {
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
		.pg-ghost:hover {
			border-color: #c3cdc8;
		}
		.okb {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background: var(--accent);
			display: inline-grid;
			place-items: center;
			flex: none;
		}
		.okb svg {
			width: 10px;
		}

		/* Explanation and "Bisher erfasst" */
		.ss-aside {
			position: sticky;
			top: 90px;
			display: grid;
			gap: 12px;
		}
		.ss-info,
		.ss-live {
			background: var(--bg);
			border-radius: 20px;
			padding: 22px 24px;
		}
		.ss-info-k {
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 15px;
			color: var(--faint);
			margin: 0 0 12px;
		}
		.ss-i {
			width: 26px;
			height: 26px;
			border-radius: 50%;
			border: 1.5px solid #c9d3ce;
			display: grid;
			place-items: center;
			font-size: 13px;
			font-style: normal;
			font-weight: 600;
			color: var(--muted);
		}
		.ss-info-b h4 {
			font-size: 16px;
			font-weight: 600;
			letter-spacing: 0;
			margin: 0 0 8px;
		}
		.ss-info-b p {
			color: var(--muted);
			font-size: 14.5px;
			line-height: 1.6;
			margin: 0 0 10px;
		}
		.ss-info-b p:last-child {
			margin-bottom: 0;
		}
		.ss-info-b b {
			color: var(--ink);
		}
		.ss-sk {
			display: grid;
			gap: 8px;
			margin-top: 14px;
		}
		.ss-sk div {
			display: grid;
			grid-template-columns: 64px 1fr;
			gap: 12px;
			align-items: center;
			background: #fff;
			border: 1px solid var(--hair);
			border-radius: 12px;
			padding: 8px;
		}
		.ss-sk svg {
			width: 64px;
			height: 44px;
		}
		.ss-sk p {
			margin: 0;
		}
		.ss-sk b {
			display: block;
			font-size: 13.5px;
		}
		.ss-sk span {
			font-size: 12.5px;
			color: var(--muted);
			line-height: 1.4;
		}
		.ss-live-r {
			display: flex;
			justify-content: space-between;
			gap: 10px;
			font-size: 13.5px;
			padding: 6px 0;
			border-top: 1px solid #e6eae8;
		}
		.ss-live-r:first-child {
			border-top: 0;
		}
		.ss-live-r span {
			color: var(--muted);
		}
		.ss-live-r b {
			font-weight: 600;
			font-variant-numeric: tabular-nums;
		}
		.ss-info {
			cursor: pointer;
			transition: background 0.2s;
		}
		.ss-info:hover {
			background: #f0f3f1;
		}
		.ss-info-k::after {
			content: "";
			width: 9px;
			height: 9px;
			margin-left: auto;
			border-right: 1.6px solid var(--muted);
			border-bottom: 1.6px solid var(--muted);
			transform: translateY(-3px) rotate(45deg);
			transition: transform 0.3s;
		}
		.ss-info:not(.fold) .ss-info-k::after {
			transform: translateY(2px) rotate(-135deg);
		}
		.ss-info.fold .ss-info-b > :not(h4) {
			display: none;
		}
		.ss-info.fold .ss-info-b h4 {
			margin: 0;
		}
		.ss-info.fold .ss-info-b::after {
			content: "Mehr anzeigen";
			display: block;
			margin-top: 8px;
			font-size: 13.5px;
			font-weight: 600;
			color: #2f7a3c;
		}
		.ss-info:not(.fold) .ss-info-b > * {
			animation: ss-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
		}
		.ss-live .ss-info-k::after {
			display: none;
		}
		/* Folded, the explanation is quieter. */
		.ss-info.fold {
			background: transparent;
			border: 1px solid var(--hair);
			padding: 16px 20px;
		}
		.ss-info.fold:hover {
			background: #fafbfa;
		}
		.ss-info.fold .ss-info-k {
			margin-bottom: 8px;
			font-size: 14px;
		}
		.ss-info.fold .ss-info-b h4 {
			font-size: 14.5px;
			font-weight: 500;
			color: var(--muted);
			opacity: 0.85;
		}
		.ss-info.fold .ss-info-b::after {
			color: var(--faint);
			font-weight: 500;
			font-size: 13px;
			margin-top: 6px;
		}
		.ss-info.fold:hover .ss-info-b::after {
			color: #2f7a3c;
		}

		/* Answer cards */
		.ss-opts {
			display: grid;
			gap: 10px;
		}
		.ss-opt {
			display: flex;
			align-items: center;
			gap: 16px;
			width: 100%;
			text-align: left;
			border: 1.5px solid var(--hair);
			background: #fff;
			border-radius: 16px;
			padding: 12px 16px 12px 12px;
			font-size: 16.5px;
			color: var(--ink);
			cursor: pointer;
			transition:
				border-color 0.2s,
				background 0.2s,
				box-shadow 0.2s;
		}
		.ss-opt:hover {
			border-color: #c9d3ce;
		}
		.ss-opt .ic {
			width: 46px;
			height: 46px;
			border-radius: 12px;
			background: #f2f4f3;
			display: grid;
			place-items: center;
			flex: none;
			transition: background 0.2s;
		}
		.ss-opt .ic svg {
			width: 22px;
			height: 22px;
			color: var(--ink);
		}
		.ss-opt .ic img {
			max-width: 38px;
			max-height: 38px;
			object-fit: contain;
			filter: drop-shadow(0 3px 4px rgba(30, 50, 45, 0.2));
		}
		.ss-opt .tx {
			flex: 1;
			min-width: 0;
		}
		.ss-opt .tx small {
			display: block;
			font-size: 13px;
			color: var(--muted);
			margin-top: 2px;
		}
		.ss-opt .ck {
			width: 22px;
			height: 22px;
			flex: none;
			opacity: 0;
			color: #3e9a57;
			transition:
				opacity 0.2s,
				transform 0.3s cubic-bezier(0.2, 1.6, 0.4, 1);
			transform: scale(0.6);
		}
		.ss-opt.on {
			border-color: var(--accent-deep);
			background: #f5fbf5;
			box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.18);
		}
		.ss-opt.on .ic {
			background: #e3f3e4;
		}
		.ss-opt.on .ck {
			opacity: 1;
			transform: none;
		}
		.ss-opts.grid2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.ss-opts.grid3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.ss-opts.cards .ss-opt {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
			padding: 14px;
			font-size: 15px;
			position: relative;
		}
		.ss-opts.cards .ss-opt .ck {
			position: absolute;
			right: 12px;
			top: 12px;
		}
		.ss-opts.cards .ss-opt .ic {
			width: 100%;
			height: 76px;
			border-radius: 10px;
			overflow: hidden;
			padding: 0;
		}
		.ss-opts.cards .ss-opt .ic svg {
			width: 100%;
			height: 100%;
		}
		.ss-rec {
			display: inline-block;
			vertical-align: 2px;
			margin-left: 8px;
			background: #e3f3e4;
			color: #2f7a3c;
			border: 1px solid #cdebd0;
			border-radius: 999px;
			padding: 2px 9px;
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 0;
		}
		.ss-zs {
			display: block;
		}
		.ss-zx {
			display: block;
			margin-top: 6px;
			font-size: 13px;
			line-height: 1.45;
			color: var(--muted);
		}
		.ss-zmore {
			margin: 14px 0 0;
			font-size: 14px;
			color: var(--muted);
		}
		.ss-zl {
			color: #2f7a3c;
			font-weight: 600;
			text-decoration: none;
			white-space: nowrap;
		}
		.ss-zl:hover {
			text-decoration: underline;
			text-underline-offset: 3px;
		}

		/* Notes and questions */
		.ss-note {
			margin-top: 14px;
			background: #eef7ef;
			color: #2f6a39;
			border-radius: 14px;
			padding: 14px 16px;
			font-size: 14.5px;
			line-height: 1.5;
		}
		.ss-note.warn {
			background: #fbf5e8;
			color: #7a5a12;
		}
		.ss-nudge {
			margin-top: 16px;
			background: #fbf5e8;
			border-radius: 14px;
			padding: 14px 16px;
			font-size: 14.5px;
			line-height: 1.5;
			color: #5c4a1a;
		}
		.ss-nudge b {
			display: block;
			color: #3f320f;
			margin-bottom: 2px;
		}
		.ss-nudge.strong {
			border: 1px solid #ebcb85;
		}
		.ss-q {
			font-size: 15.5px;
			font-weight: 600;
			color: var(--ink);
			margin: 0 0 10px;
		}
		/* `p.ss-q em`: beats `.fd em` of a question with a tooltip. */
		p.ss-q em {
			font-style: normal;
			font-weight: 400;
			font-size: 13.5px;
			color: var(--muted);
			margin-left: 6px;
		}
		.ss-lab {
			font-size: 13px;
			color: var(--muted);
			font-weight: 500;
			margin: 6px 0 10px;
		}
		.ss-sub {
			font-size: 15.5px;
			font-weight: 600;
			letter-spacing: 0;
			color: var(--ink);
			margin: 22px 0 8px;
		}
		.ss-hint {
			font-size: 13px;
			color: var(--muted);
			margin: 6px 0 0;
		}
		.ss-hint b {
			color: var(--ink);
		}
		.ss-cond {
			animation: ss-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
		}

		/* Fields (#demo-css) */
		.f2 {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 10px;
		}
		.ss-f3 {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
		}
		.ss-f21 {
			display: grid;
			grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
			gap: 10px;
		}
		.ss-f12 {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
			gap: 10px;
		}
		.fd {
			display: grid;
			gap: 6px;
			margin-top: 12px;
			font-size: 13px;
			color: var(--muted);
			font-weight: 500;
		}
		.fd em {
			font-style: normal;
			color: var(--faint);
			font-weight: 400;
		}
		.fd b {
			color: var(--ink);
		}
		.fd input,
		.fd textarea,
		.fd select {
			border: 1px solid var(--hair);
			border-radius: 9px;
			padding: 10px 12px;
			font-size: 14.5px;
			color: var(--ink);
			background-color: #fff;
			outline: 0;
			transition:
				border-color 0.2s,
				box-shadow 0.2s;
			width: 100%;
			box-sizing: border-box;
			resize: vertical;
		}
		.fd select {
			appearance: none;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%231E322D' stroke-width='1.5'/%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: right 12px center;
			padding-right: 34px;
		}
		.fd input:focus,
		.fd textarea:focus,
		.fd select:focus {
			border-color: var(--accent-deep);
			box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.25);
		}
		.fd.flash select {
			animation: ss-flash 0.9s ease-out;
		}
		.ss-sx {
			min-width: 0;
		}
		.ss-sx .ss-cond .fd {
			margin-top: 6px;
		}
		.ss-sx .ss-cond .fd > span:empty {
			display: none;
		}
		.cb {
			position: relative;
			display: flex;
			gap: 10px;
			align-items: flex-start;
			margin-top: 16px;
			font-size: 12.5px;
			color: var(--muted);
			line-height: 1.45;
			cursor: pointer;
		}
		.cb input {
			position: absolute;
			opacity: 0;
			pointer-events: none;
		}
		.cb i {
			width: 20px;
			height: 20px;
			border-radius: 6px;
			border: 1.5px solid #c9d3ce;
			display: grid;
			place-items: center;
			flex: none;
			transition: all 0.18s;
			margin-top: 1px;
		}
		.cb i svg {
			width: 10px;
			opacity: 0;
			transition: opacity 0.15s;
		}
		.cb input:checked + i {
			background: var(--accent);
			border-color: var(--accent);
		}
		.cb input:checked + i svg {
			opacity: 1;
		}
		.cb input:focus-visible + i {
			box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.4);
		}
		.cb a {
			color: var(--ink);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
		.adr-s .cb {
			margin-top: 6px;
			font-size: 14px;
			color: var(--ink);
		}
		.ss-hp {
			position: absolute;
			left: -9999px;
			width: 1px;
			height: 1px;
			overflow: hidden;
		}

		/* Tooltips: open on a click on "?" only. */
		.fd.tip {
			position: relative;
		}
		.fd.tip.qh {
			display: block;
			margin: 0;
			padding: 0;
		}
		.fd.tip.qh > p {
			margin-bottom: 10px;
		}
		.fd.tip.qh > p.ss-sub {
			margin: 22px 0 8px;
		}
		.ss-qm {
			display: inline-grid;
			place-items: center;
			width: 15px;
			height: 15px;
			padding: 0;
			border: 0;
			border-radius: 50%;
			background: #e6ebe8;
			color: var(--muted);
			font-size: 10px;
			line-height: 1;
			font-weight: 700;
			margin-left: 4px;
			vertical-align: 1px;
			cursor: pointer;
			transition:
				background 0.2s,
				color 0.2s;
		}
		.ss-qm:hover,
		.fd.tip.open .ss-qm {
			background: var(--ink);
			color: #fff;
		}
		.ss-tipb {
			position: absolute;
			left: 0;
			bottom: calc(100% + 6px);
			transform: translateY(6px);
			width: 300px;
			background: #fff;
			border: 1px solid var(--hair);
			border-radius: 14px;
			padding: 10px;
			box-shadow: 0 18px 40px -16px rgba(30, 50, 45, 0.35);
			opacity: 0;
			pointer-events: none;
			transition:
				opacity 0.2s,
				transform 0.2s;
			z-index: 40;
			display: grid;
			gap: 6px;
			text-align: left;
		}
		.ss-tipb > span {
			font-size: 12.5px;
			line-height: 1.45;
			color: var(--muted);
			font-weight: 400;
			letter-spacing: 0;
			text-transform: none;
		}
		.ss-tipb img {
			width: 100%;
			height: auto;
			border-radius: 8px;
			display: block;
			background: #fff;
		}
		.fd.tip.qh .ss-tipb:has(img) {
			width: 340px;
			bottom: auto;
			top: calc(100% + 6px);
		}
		.fd.tip.open {
			z-index: 40;
		}
		.fd.tip.open .ss-tipb {
			opacity: 1;
			transform: none;
			pointer-events: auto;
		}

		/* Multiple choice dropdown (.hzm) */
		.hzm {
			position: relative;
		}
		.hzm-btn {
			width: 100%;
			display: flex;
			align-items: center;
			gap: 10px;
			min-height: 48px;
			text-align: left;
			border: 1px solid var(--hair);
			border-radius: 12px;
			background: #fff;
			padding: 8px 14px;
			color: var(--ink);
			cursor: pointer;
			transition:
				border-color 0.2s,
				box-shadow 0.2s;
		}
		.hzm-btn:hover {
			border-color: #c3cdc8;
		}
		.hzm.open .hzm-btn {
			border-color: #8ad68f;
			box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.22);
		}
		.hzm-val {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
		}
		.hzm-ph {
			color: var(--muted);
			font-size: 15px;
		}
		.hzm-chip {
			background: #eef7ef;
			color: #1e322d;
			border: 1px solid #cdebd0;
			border-radius: 999px;
			padding: 3px 10px;
			font-size: 13.5px;
			font-weight: 500;
			animation: ss-hvpop 0.3s cubic-bezier(0.3, 1.4, 0.5, 1);
		}
		.hzm-n {
			min-width: 22px;
			height: 22px;
			border-radius: 999px;
			background: var(--ink);
			color: #fff;
			font-size: 12px;
			font-weight: 600;
			display: grid;
			place-items: center;
			padding: 0 6px;
		}
		.hzm-ar {
			width: 12px;
			height: 8px;
			flex: none;
			color: var(--ink);
			transition: transform 0.25s;
		}
		.hzm.open .hzm-ar {
			transform: rotate(180deg);
		}
		.hzm-pop {
			position: absolute;
			left: 0;
			right: 0;
			top: calc(100% + 6px);
			z-index: 30;
			background: #fff;
			border: 1px solid var(--hair);
			border-radius: 14px;
			box-shadow: 0 26px 50px -24px rgba(30, 50, 45, 0.4);
			padding: 6px;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2px;
			animation: ms-in 0.2s ease-out;
		}
		.hzm-o {
			display: flex;
			align-items: center;
			gap: 10px;
			border: 0;
			background: transparent;
			border-radius: 9px;
			padding: 10px;
			font-size: 14.5px;
			color: var(--ink);
			text-align: left;
			cursor: pointer;
			transition: background 0.15s;
		}
		.hzm-o:hover,
		.hzm-o:focus-visible {
			background: #f4f6f5;
			outline: 0;
		}
		.hzm-o i {
			width: 18px;
			height: 18px;
			border-radius: 5px;
			border: 1.5px solid #c9d3ce;
			display: grid;
			place-items: center;
			flex: none;
			transition: all 0.15s;
		}
		.hzm-o i svg {
			width: 11px;
			height: 11px;
			opacity: 0;
		}
		.hzm-o.on i {
			background: var(--ink);
			border-color: var(--ink);
		}
		.hzm-o.on i svg {
			opacity: 1;
			color: #fff;
		}
		.hzm-ft {
			grid-column: 1/-1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top: 1px solid #eef1ef;
			margin-top: 4px;
			padding: 8px 6px 2px;
		}
		.hzm-clr {
			border: 0;
			background: none;
			font-size: 13.5px;
			color: var(--muted);
			cursor: pointer;
			text-decoration: underline;
			text-underline-offset: 3px;
		}
		.hzm-ok {
			border: 0;
			background: var(--ink);
			color: #fff;
			font-size: 13.5px;
			font-weight: 600;
			border-radius: 9px;
			padding: 8px 14px;
			cursor: pointer;
		}

		/* Units */
		.ss-units {
			display: grid;
			grid-template-columns: 56px minmax(0, 1fr) 56px;
			gap: 10px;
			align-items: end;
			max-width: 460px;
		}
		.ss-units .fd {
			margin-top: 0;
		}
		.ss-units .ss-uin input {
			font-size: 22px;
			font-weight: 600;
			text-align: center;
			padding: 12px;
		}
		.ss-ub {
			height: 52px;
			border: 1px solid var(--hair);
			border-radius: 12px;
			background: #fff;
			font-size: 22px;
			color: var(--ink);
			cursor: pointer;
			transition:
				border-color 0.2s,
				background 0.2s;
		}
		.ss-ub:hover {
			border-color: #8ad68f;
			background: #f5fbf5;
		}
		.u-gw .ss-note {
			max-width: 460px;
			margin-top: 16px;
		}

		/* Upload */
		.ss-drop {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 6px;
			border: 1.5px dashed #c9d3ce;
			border-radius: 16px;
			padding: 26px 16px;
			text-align: center;
			cursor: pointer;
			background: #fafbfa;
			transition:
				border-color 0.2s,
				background 0.2s;
		}
		.ss-drop:hover,
		.ss-drop.over,
		.ss-drop:focus-within {
			border-color: var(--accent-deep);
			background: #f5fbf5;
		}
		.ss-drop b {
			font-size: 15.5px;
		}
		.ss-drop small {
			color: var(--muted);
			font-size: 13px;
		}
		.ss-drop .up {
			width: 40px;
			height: 40px;
			border-radius: 12px;
			background: var(--ink);
			color: var(--accent);
			display: grid;
			place-items: center;
			margin-bottom: 4px;
		}
		.ss-drop .up svg {
			width: 18px;
			height: 18px;
		}
		.ss-drop input {
			position: absolute;
			opacity: 0;
			pointer-events: none;
			width: 1px;
			height: 1px;
		}
		.ss-drop.sm {
			padding: 16px;
			flex-direction: row;
			justify-content: center;
			gap: 12px;
		}
		.ss-drop.sm .up {
			width: 32px;
			height: 32px;
			margin: 0;
		}
		.ss-drop.sm small {
			margin-left: 8px;
		}
		.ss-thumbs {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			margin-top: 10px;
		}
		.ss-th {
			position: relative;
			width: 72px;
			height: 72px;
			border-radius: 10px;
			overflow: hidden;
			border: 1px solid var(--hair);
			background: #f2f4f3;
			display: grid;
			place-items: center;
			font-size: 11px;
			font-weight: 600;
			color: #b5432a;
		}
		.ss-th img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		.ss-th button {
			position: absolute;
			right: 3px;
			top: 3px;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			border: 0;
			background: rgba(255, 255, 255, 0.92);
			font-size: 13px;
			line-height: 1;
			cursor: pointer;
			color: var(--ink);
		}
		.ss-exw {
			display: grid;
			grid-template-columns: 150px minmax(0, 1fr);
			gap: 12px;
			align-items: stretch;
		}
		.ss-ex {
			margin: 0;
			border: 1px solid var(--hair);
			border-radius: 14px;
			overflow: hidden;
			background: #fff;
			display: flex;
			flex-direction: column;
		}
		.ss-ex img {
			width: 100%;
			aspect-ratio: 1;
			object-fit: cover;
			display: block;
		}
		.ss-ex figcaption {
			font-size: 12px;
			color: var(--muted);
			padding: 6px 8px;
			text-align: center;
			border-top: 1px solid var(--hair);
		}
		.ss-exd {
			min-width: 0;
			display: flex;
			flex-direction: column;
		}
		.ss-exd > div {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.ss-exd .ss-drop {
			flex: 1;
			justify-content: center;
		}

		/* Groups */
		.ss-grp {
			border: 1px solid var(--hair);
			border-radius: 20px;
			padding: 22px;
			margin-top: 14px;
			background: #fff;
			animation: ss-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
		}
		.ss-grp:first-child {
			margin-top: 0;
		}
		.ss-grp-h {
			display: flex;
			align-items: center;
			gap: 12px;
			justify-content: space-between;
		}
		.ss-grp-h b {
			font-size: 17px;
			font-weight: 600;
		}
		.ss-grp-h img {
			width: 34px;
			height: 34px;
			object-fit: contain;
		}
		.ss-grp-h .l {
			display: flex;
			align-items: center;
			gap: 10px;
		}
		.ss-del {
			border: 0;
			background: none;
			font-size: 13px;
			color: var(--faint);
			cursor: pointer;
		}
		.ss-del:hover {
			color: #b5432a;
		}
		.ss-add {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			width: 100%;
			margin-top: 14px;
			border: 1.5px dashed #c9d3ce;
			border-radius: 16px;
			background: none;
			padding: 18px;
			font-size: 15.5px;
			font-weight: 600;
			color: #2f7a3c;
			cursor: pointer;
			transition:
				border-color 0.2s,
				background 0.2s;
		}
		.ss-add:hover {
			border-color: var(--accent-deep);
			background: #f5fbf5;
		}
		.ss-mid {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 8px;
			margin-top: 8px;
		}
		.ss-mid button {
			font:
				600 14px/1 ui-monospace,
				SFMono-Regular,
				Menlo,
				monospace;
			letter-spacing: 0.04em;
			color: var(--ink);
			background: #fff;
			border: 1px solid var(--hair);
			border-radius: 12px;
			padding: 14px 6px;
			cursor: pointer;
			transition:
				border-color 0.2s,
				background 0.2s;
		}
		.ss-mid button:hover {
			border-color: #c6e6c8;
		}
		.ss-mid button.on {
			background: #f2faf3;
			border-color: #8ad68f;
			box-shadow: 0 0 0 1px #8ad68f inset;
		}
		.ss-mid button[data-v="andere"] {
			grid-column: 1/-1;
			font-family: inherit;
			letter-spacing: 0;
			font-weight: 500;
		}

		/* Result */
		.ss-res-ok {
			display: flex;
			gap: 12px;
			align-items: flex-start;
			background: #eef7ef;
			color: #2f6a39;
			border-radius: 16px;
			padding: 16px 18px;
			font-size: 15px;
			line-height: 1.5;
		}
		.ss-res-ok .okb {
			width: 24px;
			height: 24px;
			margin-top: 1px;
		}
		h3.ss-res-h {
			font-size: 21px;
			font-weight: 600;
			letter-spacing: -0.02em;
			margin: 32px 0 14px;
		}
		.ss-devs {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 12px;
		}
		.ss-dev {
			border: 1px solid var(--hair);
			border-radius: 18px;
			overflow: hidden;
			background: #fff;
			display: flex;
			flex-direction: column;
			animation: ss-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		}
		.ss-dev figure {
			margin: 0;
			height: 130px;
			background: #eff2f0;
			display: grid;
			place-items: center;
			position: relative;
		}
		.ss-dev figure img {
			max-width: 62%;
			max-height: 96px;
			object-fit: contain;
			filter: drop-shadow(0 12px 14px rgba(30, 50, 45, 0.22));
		}
		.ss-dev figure img.doc {
			max-width: 86%;
			max-height: 110px;
			border-radius: 6px;
			border: 1px solid var(--hair);
			filter: none;
		}
		.ss-dev .n {
			position: absolute;
			right: 10px;
			top: 10px;
			background: var(--ink);
			color: #fff;
			font-size: 12.5px;
			font-weight: 600;
			border-radius: 999px;
			padding: 3px 10px;
		}
		.ss-dev div {
			padding: 14px 16px 16px;
			display: grid;
			gap: 4px;
		}
		.ss-dev b {
			font-size: 15.5px;
			font-weight: 600;
		}
		.ss-dev span {
			font-size: 13px;
			color: var(--muted);
			line-height: 1.45;
		}
		.ss-chip {
			justify-self: start;
			font-style: normal;
			font-size: 11.5px;
			font-weight: 600;
			border-radius: 999px;
			padding: 2px 9px;
			margin-top: 4px;
			background: #e6f5e7;
			color: #2f7a3c;
		}
		.ss-chip.chk {
			background: #fbf5e8;
			color: #7a5a12;
		}
		.ss-chk-l {
			margin: -4px 0 14px;
			font-size: 14.5px;
			color: var(--muted);
			line-height: 1.5;
		}
		.ss-k2 {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 14px;
			align-items: start;
		}
		.ss-cost {
			background: var(--bg);
			border-radius: 20px;
			padding: 22px 24px;
		}
		.ss-k2 .ss-cost {
			padding: 20px;
		}
		.ss-cost-h {
			padding-bottom: 12px;
			margin-bottom: 4px;
		}
		.ss-cost-h small {
			display: block;
			font-size: 12.5px;
			color: var(--muted);
		}
		.ss-cost-h b {
			font-size: 17px;
			font-weight: 600;
		}
		.ss-cost-r {
			display: flex;
			justify-content: space-between;
			gap: 16px;
			padding: 12px 0;
			border-top: 1px solid #e3e8e5;
			font-size: 15.5px;
		}
		.ss-cost-r:first-child {
			border-top: 0;
			padding-top: 0;
			font-weight: 600;
		}
		.ss-cost-r span {
			color: var(--muted);
		}
		.ss-cost-r:first-child span {
			color: var(--ink);
		}
		.ss-cost-r b {
			font-weight: 600;
			font-variant-numeric: tabular-nums;
			text-align: right;
		}
		.ss-cost-r b.o {
			font-weight: 500;
			color: var(--muted);
		}
		.ss-k2 .ss-cost-r {
			font-size: 14.5px;
		}
		.ss-k2 .ss-cost-r b {
			white-space: nowrap;
		}
		.ss-k2 .ss-cost-r b.o {
			white-space: normal;
			text-align: right;
		}
		.ss-cost-n {
			margin: 10px 0 0;
			font-size: 13.5px;
			color: var(--muted);
			line-height: 1.45;
		}
		.ss-cost-z {
			margin-top: 14px;
			padding: 14px 24px;
		}
		.ss-tiles {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 12px;
			margin-top: 12px;
		}
		.ss-tile {
			border: 1px solid var(--hair);
			border-radius: 18px;
			padding: 20px 22px;
			background: #fff;
		}
		.ss-tile.ink {
			background: var(--ink);
			border-color: var(--ink);
			color: #fff;
		}
		.ss-tile small {
			display: block;
			font-size: 12px;
			font-weight: 600;
			color: var(--faint);
		}
		.ss-tile.ink small {
			color: var(--accent);
		}
		.ss-tile b {
			display: block;
			font-size: clamp(28px, 3vw, 38px);
			font-weight: 500;
			letter-spacing: -0.03em;
			margin-top: 6px;
			font-variant-numeric: tabular-nums;
		}
		.ss-tile span {
			display: block;
			font-size: 13.5px;
			color: var(--muted);
			margin-top: 4px;
		}
		.ss-tile.ink span {
			color: rgba(255, 255, 255, 0.66);
		}
		.ss-fine {
			color: var(--faint);
			font-size: 13px;
			line-height: 1.55;
			margin: 16px 0 0;
		}
		.ss-checks {
			background: #fbf5e8;
			border-radius: 18px;
			padding: 18px 22px;
			list-style: none;
			margin: 0;
			display: grid;
			gap: 8px;
		}
		.ss-checks li {
			display: flex;
			flex-direction: column;
			gap: 4px;
			font-size: 15px;
			color: #5c4a1a;
			line-height: 1.45;
		}
		.ss-checks li + li {
			border-top: 1px solid #efe2c2;
			padding-top: 10px;
		}
		.ss-ck-t {
			display: flex;
			justify-content: space-between;
			gap: 12px;
			align-items: flex-start;
		}
		.ss-ck-t b {
			font-weight: 600;
			color: #3f320f;
		}
		.ss-checks small {
			font-size: 13.5px;
			color: #7a6630;
			line-height: 1.45;
		}
		.ss-who {
			font-style: normal;
			font-size: 12px;
			font-weight: 600;
			white-space: nowrap;
			padding: 3px 9px;
			border-radius: 999px;
			background: #f3e3bc;
			color: #5c4a1a;
		}
		.ss-who.h {
			background: #e3f3e4;
			color: #2f6a39;
		}

		/* "So geht es weiter" */
		.ss-ns {
			margin-top: 26px;
			background: var(--ink);
			color: #fff;
			border-radius: 22px;
			padding: 24px 24px 20px;
		}
		.ss-ns-h {
			margin: 0 0 14px;
			font-size: 19px;
			font-weight: 600;
			letter-spacing: -0.01em;
		}
		.ss-ns ol {
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
		}
		.ss-ns li {
			display: flex;
			align-items: flex-start;
			gap: 12px;
			overflow-wrap: anywhere;
			background: rgba(255, 255, 255, 0.06);
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 16px;
			padding: 16px;
			font-size: 13.5px;
			line-height: 1.45;
			color: rgba(255, 255, 255, 0.72);
		}
		.ss-ns li b {
			display: block;
			color: #fff;
			font-size: 15.5px;
			font-weight: 600;
			margin-bottom: 3px;
		}
		.ss-ns .n {
			flex: none;
			width: 30px;
			height: 30px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.12);
			display: grid;
			place-items: center;
			font-size: 14px;
			font-weight: 600;
			color: #fff;
		}
		.ss-ns li.cur {
			background: #fff;
			color: var(--muted);
			border-color: #fff;
		}
		.ss-ns li.cur b {
			color: var(--ink);
		}
		.ss-ns li.cur .n {
			background: #8ad68f;
			color: var(--ink);
		}
		.ss-ns li.done .n {
			background: #8ad68f;
		}
		.ss-ns li.done .n svg {
			width: 14px;
			height: 14px;
			color: var(--ink);
		}

		/* The offer: sending and confirmation */
		.ss-send1 {
			display: flex;
			align-items: center;
			gap: 14px;
			flex-wrap: wrap;
			margin-top: 24px;
		}
		.ss-send1 .bk-next {
			width: auto;
			margin-top: 0;
			padding-inline: 28px;
		}
		.ss-send1 small {
			font-size: 14px;
			color: var(--muted);
		}
		.ss-msg {
			min-height: 20px;
			margin: 10px 0 0;
			font-size: 13.5px;
			color: #2f6a39;
		}
		.ss-msg.err {
			color: #b4432b;
		}
		.ss-msg a {
			color: inherit;
			text-decoration: underline;
			text-underline-offset: 3px;
		}
		.ss-conf {
			text-align: center;
			background: var(--bg);
			border-radius: 22px;
			padding: 36px 24px 28px;
		}
		.ss-conf-i svg {
			display: inline-block;
			width: 64px;
			height: 64px;
		}
		.ss-conf-i circle {
			fill: #8ad68f;
		}
		.ss-conf-i path {
			fill: none;
			stroke: #1e322d;
			stroke-width: 3.2;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke-dasharray: 40;
			stroke-dashoffset: 40;
			animation: ssck 0.5s 0.25s ease-out forwards;
		}
		.ss-conf h3 {
			font-size: 26px;
			font-weight: 600;
			letter-spacing: -0.02em;
			margin: 14px 0 8px;
		}
		.ss-conf p {
			font-size: 15.5px;
			color: var(--muted);
			max-width: 46ch;
			margin: 0 auto;
			line-height: 1.5;
		}
		.ss-conf p b {
			color: var(--ink);
		}
		.ss-conf-d {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
			margin: 22px 0 0;
			text-align: left;
		}
		.ss-conf-d div {
			background: #fff;
			border-radius: 14px;
			padding: 12px 14px;
		}
		.ss-conf-d dt {
			font-size: 12px;
			color: var(--muted);
		}
		.ss-conf-d dd {
			margin: 3px 0 0;
			font-size: 14px;
			font-weight: 600;
			word-break: break-word;
		}
		.ss-ends {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			margin-top: 28px;
			align-items: center;
		}
		.ss-restart {
			border: 0;
			background: none;
			font-size: 14px;
			color: var(--faint);
			cursor: pointer;
			text-decoration: underline;
			text-underline-offset: 4px;
		}

		/* Resume bar */
		.ss-resume {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			flex-wrap: wrap;
			background: #eef7ef;
			border-radius: 14px;
			padding: 12px 16px;
			margin-bottom: 18px;
			font-size: 14px;
			color: #2f6a39;
		}
		.ss-resume button {
			border: 0;
			background: none;
			font-weight: 600;
			color: #2f7a3c;
			cursor: pointer;
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	@media (max-width: 1040px) {
		.ss-wiz :global {
			.ss-grid {
				grid-template-columns: minmax(0, 1fr);
			}
			.ss-aside {
				position: static;
				order: -1;
			}
			.ss-live {
				display: none;
			}
			.ss-info {
				padding: 16px 18px;
			}
		}
	}
	@media (max-width: 760px) {
		.ss-wiz :global {
			.ss-tipb {
				width: 190px;
			}
			.ss-k2,
			.ss-ns ol {
				grid-template-columns: minmax(0, 1fr);
			}
		}
	}
	@media (max-width: 640px) {
		.ss-wiz {
			border-radius: 20px;
			padding: 18px;
		}
		.ss-wiz :global {
			.ss-opts.grid2,
			.ss-opts.grid3 {
				grid-template-columns: minmax(0, 1fr);
			}
			.ss-opts.cards.grid3 {
				grid-template-columns: 1fr 1fr;
			}
			.ss-f3 {
				grid-template-columns: 1fr 1fr;
			}
			.ss-f21,
			.ss-f12,
			.ss-tiles {
				grid-template-columns: minmax(0, 1fr);
			}
			.ss-opt {
				font-size: 15.5px;
			}
			.ss-grp {
				padding: 16px;
			}
			.hzm-pop {
				grid-template-columns: 1fr;
			}
			.ss-conf-d {
				grid-template-columns: minmax(0, 1fr);
			}
		}
	}
	@media (max-width: 560px) {
		.ss-wiz :global(.ss-mid) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (max-width: 520px) {
		.ss-wiz :global {
			.ss-exw {
				grid-template-columns: minmax(0, 1fr);
			}
			.ss-ex {
				flex-direction: row;
				align-items: center;
			}
			.ss-ex img {
				width: 96px;
				flex: none;
			}
			.ss-ex figcaption {
				border-top: 0;
				text-align: left;
			}
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ss-wiz :global {
			.ss-main.anim,
			.ss-grp,
			.ss-dev,
			.ss-cond,
			.ss-info:not(.fold) .ss-info-b > *,
			.hzm-chip,
			.hzm-pop {
				animation: none;
			}
			.ss-conf-i path {
				animation: none;
				stroke-dashoffset: 0;
			}
		}
	}
</style>
