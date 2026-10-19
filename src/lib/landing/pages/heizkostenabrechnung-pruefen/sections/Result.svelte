<!--
  The result pane (#mc-res): the dark head with the sum counting up, the
  checked points (locked behind the paywall's teaser until unlocked), the
  letter button, "Werte ändern" and "Neue Abrechnung prüfen". Confetti from
  the sum for a claim, 500 ms after it shows.
-->
<script lang="ts">
	import { tick } from "svelte";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import { getBillCheck } from "../check.svelte";
	import { card, LETTER_ID } from "../content";
	import { formatNumber, teaser } from "../rules";
	import Points from "./Points.svelte";

	const check = getBillCheck();
	const t = card.result;

	let shown = $state(0);
	let figure: HTMLElement | undefined = $state();

	$effect(() => {
		const head = check.head;
		if (!head) return;
		const stopTween = tweenNumber(0, head.value, 900, (v) => (shown = v));
		let stopConfetti: (() => void) | undefined;
		const timer = head.celebrate
			? setTimeout(() => {
					if (figure) stopConfetti = confettiFrom(figure);
				}, 500)
			: undefined;
		return () => {
			stopTween();
			clearTimeout(timer);
			stopConfetti?.();
		};
	});

	async function makeLetter() {
		check.makeLetter();
		await tick();
		const section = document.getElementById(LETTER_ID);
		if (!section) return;
		window.scrollTo({
			top: section.getBoundingClientRect().top + window.scrollY - 72,
			behavior: prefersReducedMotion() ? "auto" : "smooth",
		});
	}
</script>

{#if check.result && check.head}
	{@const head = check.head}
	<div class={["rh", head.zero && "zero"]}>
		<small>{head.label}</small>
		<div class="big">
			{#if head.upTo}<span>{t.upTo}</span>{/if}<b bind:this={figure}
				>{formatNumber(shown, 0)}</b
			><i>{head.unit}</i>
		</div>
		<p>{head.sub}</p>
	</div>
	{#if check.unlocked}
		<Points points={check.result.points} hasHeating={check.result.hasHeating} />
	{:else if check.result.points.length}
		<div class="tz">
			<div class="tz-l">
				<b>{teaser(check.result.points)}</b><small>{t.teaserNote}</small>
			</div>
			<div class="tz-rows" aria-hidden="true"><i></i><i></i><i></i></div>
			<button
				type="button"
				class="bk-next open"
				onclick={() => (check.dialogOpen = true)}
				>{t.open} <span class="ar">→</span></button
			>
		</div>
	{/if}
	<div class="ra">
		{#if head.letter && check.unlocked}
			<button type="button" class="bk-next" onclick={makeLetter}
				>{t.letter} <span class="ar">→</span></button
			>
		{/if}
		<button type="button" class="pg-ghost" onclick={() => check.showPane("man")}
			>{t.edit}</button
		>
	</div>
	<button type="button" class="demo" onclick={() => check.reset()}
		>{t.again}</button
	>
{/if}

<style>
	.rh {
		background: var(--ink);
		color: #fff;
		border-radius: 16px;
		padding: 20px 20px 18px;
	}
	.rh small {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.7);
	}
	.big {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-top: 4px;
	}
	.big span {
		font-size: 15px;
		color: rgba(255, 255, 255, 0.7);
	}
	.big b {
		font-size: clamp(46px, 5vw, 64px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}
	.big i {
		font-style: normal;
		font-size: 24px;
		color: rgba(255, 255, 255, 0.85);
	}
	.rh p {
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.75);
		margin-top: 8px;
		line-height: 1.45;
	}
	.zero .big b {
		color: #fff;
	}
	/* .pw-tz */
	.tz {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 12px;
		align-items: center;
		margin-top: 14px;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 14px;
		background: #fff;
	}
	.tz-l b {
		display: block;
		font-size: 15px;
		font-weight: 600;
	}
	.tz-l small {
		font-size: 12.5px;
		color: var(--muted);
	}
	.tz-rows {
		grid-column: 1/-1;
		display: grid;
		gap: 6px;
		filter: blur(3px);
		opacity: 0.7;
	}
	.tz-rows i {
		display: block;
		height: 34px;
		border-radius: 9px;
		background: linear-gradient(90deg, #f4f6f5, #eef1ef);
	}
	.tz-rows i:first-child {
		background: #fdf0ea;
	}
	.open {
		grid-column: 1/-1;
	}
	.ra {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 8px;
		margin-top: 14px;
	}
	.ra .bk-next {
		margin: 0;
		padding: 13px 14px;
	}
	.ra .pg-ghost {
		padding: 12px 14px;
		font-size: 14.5px;
	}
	.demo {
		display: block;
		margin: 12px auto 0;
		border: 0;
		background: none;
		font: inherit;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
		cursor: pointer;
		/* The browser's button padding (Tailwind's preflight zeroes it). */
		padding: 1px 6px;
	}
	@media (max-width: 640px) {
		.ra {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
