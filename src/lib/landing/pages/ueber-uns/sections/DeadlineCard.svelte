<!--
  "Bis zur Fernablesepflicht … Tage" with the elapsed share of 2022–2026.
  The same day count as /fernablesung-umruesten (Berlin calendar days, from the page's
  clock). SSR renders the final number and bar; in the browser the number
  counts up and the bar grows when the card scrolls into view.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { countUp } from "$lib/landing/attachments/countUp";
	import { inView } from "$lib/landing/attachments/inView";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { daysLeft, retrofitProgress } from "$lib/landing/deadline/deadline";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { mission } from "../content";

	const card = mission.card;
	const clock = getDeadlineClock();
	const days = $derived(daysLeft(clock.today));
	const progress = $derived(retrofitProgress(clock.today));

	// Below the fold the bar starts empty and grows once in view; on screen,
	// without JS or with reduced motion it shows its width right away.
	let grown = $state(true);
	let el: HTMLElement;
	let timer: ReturnType<typeof setTimeout> | undefined;
	onMount(() => {
		if (
			!prefersReducedMotion() &&
			el.getBoundingClientRect().top >= window.innerHeight
		)
			grown = false;
		return () => clearTimeout(timer);
	});
	const grow = () => (timer = setTimeout(() => (grown = true), 200));
</script>

<div
	class="cd rv"
	bind:this={el}
	{@attach inView({
		threshold: 0.35,
		once: true,
		onEnter: grow,
	})}
>
	{#if clock.expired}
		<p class="n x" data-placeholder="">{card.expired}</p>
	{:else}
		<small>{card.label}</small>
		{#if days === 0}
			<p class="n"><b class="last">{card.lastDay}</b></p>
		{:else}
			<p class="n">
				{#key days}<b {@attach countUp({ to: days, duration: 1200 })}>{days}</b
					>{/key}<span>{card.unit}</span>
			</p>
		{/if}
	{/if}
	<div class="bar"><i style:width="{(grown ? progress : 0) * 100}%"></i></div>
	<div class="l"><span>{card.from}</span><span>{card.to}</span></div>
</div>

<style>
	.cd {
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 32px;
	}
	small {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.66);
	}
	.n {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-top: 6px;
	}
	b {
		font-size: clamp(64px, 7vw, 96px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}
	b.last {
		font-size: clamp(44px, 5vw, 64px);
	}
	.n span {
		font-size: 22px;
		color: rgba(255, 255, 255, 0.8);
	}
	.n.x {
		margin-top: 0;
		font-size: clamp(28px, 3vw, 38px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--accent);
	}
	.bar {
		height: 6px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		margin-top: 26px;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: var(--accent);
		border-radius: 999px;
		transition: width 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.l {
		display: flex;
		justify-content: space-between;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.55);
		margin-top: 10px;
	}
</style>
