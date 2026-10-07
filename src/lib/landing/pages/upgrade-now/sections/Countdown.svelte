<!--
  Days, hours, minutes and seconds to the deadline. A changed digit slides in
  while the old one slides out; with reduced motion the text just changes.
  The boxes have a fixed size, so a change never shifts the layout.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { cubicIn, cubicOut } from "svelte/easing";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { hero } from "../content";
	import { remaining } from "../deadline";
	import { getDeadlineClock } from "../clock.svelte";

	const clock = getDeadlineClock();
	const pad = (n: number) => String(n).padStart(2, "0");
	const units = $derived.by(() => {
		const r = remaining(clock.now);
		return [r.days, r.hours, r.minutes, r.seconds].map(pad);
	});

	// The first client tick replaces the server's time without sliding.
	let ready = false;
	onMount(() => {
		const frame = requestAnimationFrame(() => (ready = true));
		return () => cancelAnimationFrame(frame);
	});

	const slide =
		(direction: 1 | -1) =>
		(_node: Element, { delay = 0 } = {}) => ({
			delay,
			duration:
				!ready || prefersReducedMotion() ? 0 : direction === 1 ? 550 : 500,
			easing: direction === 1 ? cubicOut : cubicIn,
			css: (t: number) =>
				`transform:translateY(${direction * (1 - t) * 62}%);opacity:${t};filter:blur(${(1 - t) * 2}px)`,
		});
	const slideIn = slide(1);
	const slideOut = slide(-1);
</script>

<div class="cd" role="timer" aria-live="off" aria-label={hero.countdownLabel}>
	{#each units as value, i (i)}
		{#if i > 0}<i class="sep" aria-hidden="true">:</i>{/if}
		<div class="u">
			<div class={["n", i === 0 && "d"]}>
				{#key value}
					<span in:slideIn out:slideOut>{value}</span>
				{/key}
			</div>
			<small>{hero.units[i]}</small>
		</div>
	{/each}
</div>

<style>
	.cd {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: clamp(6px, 1.4vw, 18px);
		margin-top: 44px;
	}
	.u {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.n {
		position: relative;
		overflow: hidden;
		min-width: clamp(78px, 10vw, 148px);
		height: clamp(84px, 10.5vw, 152px);
		border-radius: clamp(14px, 1.6vw, 22px);
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 20px 40px -20px rgba(0, 0, 0, 0.5);
	}
	.n::after {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		background: rgba(0, 0, 0, 0.25);
		box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04);
	}
	.n span {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: clamp(46px, 6.4vw, 96px);
		font-weight: 500;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.n.d {
		min-width: clamp(104px, 13vw, 196px);
	}
	.n.d span {
		color: var(--accent);
	}
	small {
		font-size: 13px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
		font-weight: 500;
	}
	.sep {
		font-style: normal;
		font-size: clamp(30px, 4vw, 60px);
		color: rgba(255, 255, 255, 0.25);
		line-height: clamp(84px, 10.5vw, 152px);
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.35;
		}
	}
	@media (max-width: 640px) {
		.cd {
			gap: 4px;
			margin-top: 32px;
		}
		.sep {
			display: none;
		}
		.n,
		.n.d {
			min-width: 0;
			width: calc((100vw - 32px - 12px) / 4);
			height: 76px;
			border-radius: 12px;
		}
		.n span {
			font-size: 38px;
		}
		small {
			font-size: 10.5px;
			letter-spacing: 0.04em;
		}
	}
</style>
