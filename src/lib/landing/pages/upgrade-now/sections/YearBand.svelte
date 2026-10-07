<!--
  The 12 months of 2026 and how much of each has passed. The SSR markup has
  the final fills; in the browser they grow one after the other when the band
  first comes into view (not with reduced motion).
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { hero } from "../content";
	import { yearProgress } from "../deadline";
	import { getDeadlineClock } from "../clock.svelte";

	const clock = getDeadlineClock();
	const year = $derived(yearProgress(clock.today));

	let band: HTMLElement;
	/** False only between mount and the first view: the fills are at 0 then. */
	let grown = $state(true);
	let animate = $state(false);

	onMount(() => {
		if (prefersReducedMotion()) return;
		const rect = band.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) return;
		animate = true;
		grown = false;
	});
</script>

<div
	class="year rv"
	aria-label={hero.yearLabel}
	bind:this={band}
	{@attach inView({
		threshold: 0.15,
		once: true,
		onEnter: () => (grown = true),
	})}
>
	<div class="year-h">
		<span>{year.progressText}</span><span>{year.windowText}</span>
	</div>
	<div class={["year-g", animate && "anim"]}>
		{#each year.months as m, i (m.label)}
			<div
				class={["m", m.state, m.state === "cur" && "left", m.deadline && "dl"]}
				style:--p={m.state === "cur"
					? `${(m.fill * 100).toFixed(1)}%`
					: undefined}
			>
				<i
					style:width={`${grown ? m.fill * 100 : 0}%`}
					style:transition-delay={animate ? `${i * 70}ms` : undefined}
				></i>
				<b>{m.label}</b>
			</div>
		{/each}
	</div>
</div>

<style>
	.year {
		width: 100%;
		max-width: 980px;
		margin-top: 64px;
		text-align: left;
	}
	.year-h {
		display: flex;
		justify-content: space-between;
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 12px;
		gap: 12px;
	}
	.year-h span:last-child {
		color: var(--accent);
		font-weight: 500;
		text-align: right;
	}
	.year-g {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 6px;
	}
	.m {
		position: relative;
		height: 56px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.09);
		overflow: hidden;
	}
	.m i {
		position: absolute;
		inset: 0 auto 0 0;
		background: rgba(255, 255, 255, 0.13);
	}
	.anim .m i {
		transition: width 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.m b {
		position: absolute;
		left: 10px;
		bottom: 8px;
		font-size: 12.5px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.5);
		z-index: 1;
	}
	.m.past b {
		color: rgba(255, 255, 255, 0.38);
		text-decoration: line-through;
		text-decoration-color: rgba(255, 255, 255, 0.3);
	}
	.m.left {
		border-color: rgba(138, 214, 143, 0.55);
		background: rgba(138, 214, 143, 0.08);
	}
	.m.left b {
		color: var(--accent);
	}
	.m.cur {
		border-color: var(--accent);
	}
	.m.cur::after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: var(--p, 0%);
		width: 2px;
		background: var(--accent);
		box-shadow: 0 0 12px var(--accent);
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}
	.m.dl {
		border-color: var(--accent);
		background: rgba(138, 214, 143, 0.16);
	}
	.m.dl::before {
		content: "";
		position: absolute;
		right: 7px;
		top: 7px;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: var(--accent);
	}
	@media (max-width: 760px) {
		.year-g {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.year {
			margin-top: 44px;
		}
		.year-h {
			flex-direction: column;
			gap: 4px;
		}
		.year-h span:last-child {
			text-align: left;
		}
		.m {
			height: 44px;
		}
	}
</style>
