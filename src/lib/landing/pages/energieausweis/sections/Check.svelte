<!--
  "Vier Fragen. Dann wissen Sie es." (.pg-sec#check): the head and the
  wizard (.ea-wiz). One question at a time with lettered answers, "Zurück",
  the step line and the bar; the result with its badge, the matching offers,
  "Passende Angebote ansehen ↓" (sets the page's offer filter) and "Neu
  starten". Confetti on free choice. Without JS the card is hidden: the
  comparison's "Pflicht für" row holds its rule.
-->
<script lang="ts">
	import { onDestroy, tick } from "svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import {
		answer,
		filterFor,
		progress,
		resultOffers,
		type Step,
	} from "../check";
	import { CHECK_ID, check, type OfferFilter, offers } from "../content";

	let { onpick }: { onpick: (filter: OfferFilter) => void } = $props();

	const total = check.questions.length;
	let step = $state<Step>({ kind: "question", index: 0 });
	const resultKey = $derived(step.kind === "result" ? step.result : undefined);
	const result = $derived(check.results.find((r) => r.key === resultKey));
	const picks = $derived(
		resultKey ? resultOffers(resultKey, offers.items) : [],
	);

	let heading: HTMLElement | undefined = $state();
	let badge: HTMLElement | undefined = $state();
	let stopConfetti: (() => void) | undefined;

	/** Shows a step and gives its heading the focus (the answer is gone). */
	async function go(next: Step) {
		step = next;
		await tick();
		heading?.focus({ preventScroll: true });
		if (next.kind === "result" && next.result === "free" && badge) {
			stopConfetti?.();
			stopConfetti = confettiFrom(badge);
		}
	}

	onDestroy(() => stopConfetti?.());
</script>

<section class="pg-sec chk" id={CHECK_ID} aria-labelledby="ea-chk-h">
	<div class="wrap cols">
		<div>
			<SectionHead id="ea-chk-h" eyebrow={check.pill} heading={check.h2}>
				{#snippet icon()}
					<circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" />
				{/snippet}
			</SectionHead>
			<p class="lead rv">{check.lead}</p>
			<p class="src rv">{check.source}</p>
		</div>
		<div class="wiz rv" role="group" aria-label={check.label}>
			<div class="top">
				<span class="st"
					>{step.kind === "result"
						? check.resultStep
						: check.step
								.replace("{n}", String(step.index + 1))
								.replace("{total}", String(total))}</span
				>
				<span class="prog"
					><i style:width={`${progress(step, total)}%`}></i></span
				>
			</div>
			{#key step}
				{#if step.kind === "question"}
					{@const q = check.questions[step.index]}
					{@const index = step.index}
					<div class="q">
						<h3 tabindex="-1" bind:this={heading}>{q.title}</h3>
						<p>{q.hint}</p>
						<div class="ans">
							{#each q.answers as a, k (a.value)}
								<button type="button" onclick={() => go(answer(index, a.value))}
									><i aria-hidden="true">{String.fromCharCode(65 + k)}</i
									>{a.label}</button
								>
							{/each}
						</div>
						{#if index > 0}
							<button
								type="button"
								class="back"
								onclick={() => go({ kind: "question", index: index - 1 })}
								><StrokeIcon><path d="M12 5l-5 5 5 5" /></StrokeIcon><u
									>{check.back}</u
								></button
							>
						{/if}
					</div>
				{:else if result}
					{@const key = result.key}
					<div class="res">
						<span
							class={["rk", result.kind === "must" && "must"]}
							bind:this={badge}>{check.badges[result.kind]}</span
						>
						<h3 tabindex="-1" bind:this={heading}>{result.title}</h3>
						<p>{result.text}</p>
						<div class="pick">
							{#each picks as offer, k (offer.title)}
								<div class={[k === 0 && "top1"]}>
									<span>{offer.title}</span><b>{offers.from} {offer.price}</b>
								</div>
							{/each}
						</div>
						<div class="act">
							<a
								class="bk"
								href={check.go.href}
								onclick={() => onpick(filterFor(key))}
								>{check.go.text} <span class="ar" aria-hidden="true">↓</span></a
							>
							<button
								type="button"
								class="again"
								onclick={() => go({ kind: "question", index: 0 })}
								>{check.again}</button
							>
						</div>
					</div>
				{/if}
			{/key}
		</div>
	</div>
</section>

<style>
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 56px;
		align-items: start;
	}
	/* The landing heading reset takes SectionHead's 18 px top margin. */
	.chk :global(h2) {
		margin-top: 18px;
	}
	/* .dm-lead */
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	/* .pg-src */
	.src {
		margin-top: 18px;
		font-size: 13px;
		color: var(--faint);
	}
	.wiz {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 24px 26px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
		min-height: 380px;
		overflow: hidden;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}
	.st {
		font-size: 13px;
		font-weight: 600;
		color: var(--muted);
		white-space: nowrap;
	}
	.prog {
		flex: 1;
		max-width: 220px;
		height: 5px;
		border-radius: 999px;
		background: #e5eae7;
		overflow: hidden;
	}
	.prog i {
		display: block;
		height: 100%;
		width: 0;
		background: var(--ink);
		border-radius: 999px;
		transition: width 0.4s;
	}
	.q {
		margin-top: 26px;
		animation: ea-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes ea-in {
		from {
			opacity: 0;
			transform: translateX(16px);
		}
	}
	/* `.wiz h3`: beats the landing reset of heading margins. */
	.q h3 {
		font-size: clamp(21px, 2vw, 25px);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.25;
		text-wrap: balance;
	}
	.wiz h3:focus {
		outline: none;
	}
	.q p {
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 8px;
		line-height: 1.5;
		min-height: 1.5em;
	}
	.ans {
		display: grid;
		gap: 10px;
		margin-top: 20px;
	}
	.ans button {
		display: flex;
		align-items: center;
		gap: 14px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 13px;
		padding: 14px 16px;
		font: inherit;
		font-size: 15.5px;
		font-weight: 500;
		color: var(--ink);
		cursor: pointer;
		text-align: left;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.ans button:hover {
		border-color: #bfcac4;
		background: #fafbfa;
	}
	.ans i {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--bg);
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		font-style: normal;
		font-size: 13px;
		font-weight: 700;
		color: var(--muted);
		flex: none;
	}
	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 0;
		background: none;
		font: inherit;
		font-size: 14px;
		color: var(--muted);
		cursor: pointer;
		margin-top: 14px;
		padding: 4px 0;
	}
	.back :global(svg) {
		width: 15px;
		height: 15px;
	}
	.res {
		margin-top: 22px;
		animation: ea-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.rk {
		display: inline-flex;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		border-radius: 999px;
		padding: 4px 10px;
		background: #e3f3e4;
		color: #2f7a3c;
	}
	.rk.must {
		background: #fbe3dc;
		color: #a8452e;
	}
	.res h3 {
		font-size: 26px;
		font-weight: 500;
		letter-spacing: -0.025em;
		margin-top: 14px;
	}
	.res p {
		font-size: 15px;
		color: var(--muted);
		line-height: 1.55;
		margin-top: 8px;
	}
	.pick {
		display: grid;
		gap: 8px;
		margin-top: 16px;
	}
	.pick div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 11px 14px;
		font-size: 14.5px;
		font-weight: 500;
	}
	.pick b {
		font-variant-numeric: tabular-nums;
	}
	.pick div.top1 {
		border-color: var(--ink);
		background: var(--bg);
	}
	.act {
		display: flex;
		gap: 10px;
		margin-top: 18px;
		flex-wrap: wrap;
	}
	/* .bk-next */
	.bk {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #2a443d;
	}
	.bk:active {
		transform: scale(0.98);
	}
	.ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateX(4px);
	}
	/* .bk-ghost */
	.again {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--hair);
		border-radius: 11px;
		padding: 0 18px;
		min-height: 48px;
		font: inherit;
		font-size: 14.5px;
		font-weight: 500;
		color: var(--ink);
		background: #fff;
		cursor: pointer;
	}
	.again:hover {
		border-color: #c9d3ce;
	}
	@media (max-width: 1040px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
	}
	@media (max-width: 640px) {
		.wiz {
			padding: 20px 18px;
			min-height: 0;
		}
		.bk {
			flex-basis: 100%;
		}
	}
	/* Nothing can answer the questions without JS. */
	@media (scripting: none) {
		.wiz {
			display: none;
		}
	}
</style>
