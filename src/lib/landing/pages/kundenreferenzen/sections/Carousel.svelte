<!--
  The hero's quote carousel (the design's `#rf-rot`): the three shared
  quotes, stacked in one grid cell so the card keeps the tallest one's
  height. With motion it moves on every 7 s (the active dot fills meanwhile),
  pausing while the pointer is over it or focus is inside; the dots, the
  arrows and a swipe pick a quote. Server-rendered on the first quote; without
  JS the controls are hidden, with reduced motion nothing moves on its own.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import VerifiedBadge from "$lib/landing/components/icons/VerifiedBadge.svelte";
	import { testimonial } from "$lib/landing/data/testimonials";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { carousel } from "../content";

	const quotes = carousel.order.map(testimonial);

	let index = $state(0);
	/** Bumped on every move, so the active dot's fill starts over. */
	let round = $state(0);
	let motion = $state(false);
	let hover = $state(false);
	let focus = $state(false);
	let touchX: number | null = null;

	const paused = $derived(hover || focus);

	function go(n: number) {
		index = (n + quotes.length) % quotes.length;
		round++;
	}

	onMount(() => {
		motion = !prefersReducedMotion();
	});

	$effect(() => {
		void round;
		if (!motion || paused) return;
		const timer = setTimeout(() => go(index + 1), carousel.duration);
		return () => clearTimeout(timer);
	});

	function onfocusout(e: FocusEvent) {
		const root = e.currentTarget as HTMLElement;
		if (root.contains(e.relatedTarget as Node | null)) return;
		focus = false;
		go(index);
	}

	function ontouchend(e: TouchEvent) {
		if (touchX === null) return;
		const dx = e.changedTouches[0].clientX - touchX;
		if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
		touchX = null;
	}
</script>

<div
	class={["rot rv", motion && "run", paused && "paused"]}
	role="region"
	aria-roledescription="Karussell"
	aria-label={carousel.label}
	style:--dur="{carousel.duration / 1000}s"
	onmouseenter={() => (hover = true)}
	onmouseleave={() => {
		hover = false;
		go(index);
	}}
	onfocusin={() => (focus = true)}
	{onfocusout}
	ontouchstart={(e) => (touchX = e.touches[0].clientX)}
	{ontouchend}
>
	<div class="rh">
		<span class="ver"><VerifiedBadge />{carousel.badge}</span>
		<span class="cnt">{index + 1} / {quotes.length}</span>
	</div>
	<div class="slides" aria-live={motion && !paused ? "off" : "polite"}>
		{#each quotes as quote, k (quote.key)}
			<figure class={["slide", k === index && "on"]} aria-hidden={k !== index}>
				<blockquote>{quote.quote}</blockquote>
				<figcaption>
					<span class="av">{quote.initials}</span><span
						><b>{quote.name}</b>{quote.role}</span
					>
				</figcaption>
			</figure>
		{/each}
	</div>
	<div class="nav">
		<div class="dots">
			{#each quotes as quote, k (quote.key)}
				<button
					type="button"
					class={[k === index && "on", k < index && "done"]}
					aria-label={carousel.dot(k + 1)}
					aria-current={k === index}
					onclick={() => go(k)}
				>
					{#key k === index ? round : -1}<i></i>{/key}
				</button>
			{/each}
		</div>
		<div class="arr">
			<button
				type="button"
				aria-label={carousel.prev}
				onclick={() => go(index - 1)}><Icon name="prev" /></button
			>
			<button
				type="button"
				aria-label={carousel.next}
				onclick={() => go(index + 1)}><Icon name="next" /></button
			>
		</div>
	</div>
</div>

<style>
	.rot {
		background: var(--ink);
		color: #fff;
		border-radius: 24px;
		padding: 26px 28px 22px;
		position: relative;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.55);
	}
	.rh {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	/* .tm-ver */
	.ver {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13px;
		font-weight: 600;
		color: var(--accent);
	}
	.ver :global(svg) {
		width: 18px;
		height: 18px;
	}
	.cnt {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.55);
		font-variant-numeric: tabular-nums;
	}
	.slides {
		display: grid;
		margin-top: 18px;
	}
	.slide {
		grid-area: 1/1;
		margin: 0;
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.6s,
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
		pointer-events: none;
		display: flex;
		flex-direction: column;
	}
	.slide.on {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}
	blockquote {
		margin: 0;
		font-size: clamp(21px, 2.1vw, 27px);
		line-height: 1.35;
		letter-spacing: -0.02em;
		font-weight: 500;
		text-wrap: pretty;
	}
	figcaption {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: auto;
		padding-top: 20px;
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.65);
	}
	figcaption b {
		display: block;
		color: #fff;
		font-size: 15px;
	}
	.av {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 14px;
		flex: none;
	}
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	.dots {
		display: flex;
		gap: 8px;
	}
	.dots button {
		width: 42px;
		height: 6px;
		border: 0;
		padding: 0;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.15);
		cursor: pointer;
		overflow: hidden;
		position: relative;
	}
	.dots i {
		position: absolute;
		inset: 0;
		width: 0;
		background: var(--accent);
		border-radius: 999px;
	}
	.dots .done i,
	.rot:not(.run) .dots .on i {
		width: 100%;
	}
	.run .dots .on i {
		animation: rf-prog var(--dur, 7s) linear forwards;
	}
	.paused .dots .on i {
		animation-play-state: paused;
	}
	@keyframes rf-prog {
		to {
			width: 100%;
		}
	}
	.arr {
		display: flex;
		gap: 6px;
	}
	.arr button {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: none;
		color: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}
	.arr button:hover {
		background: rgba(255, 255, 255, 0.08);
	}
	.arr :global(svg) {
		width: 16px;
		height: 16px;
	}

	@media (max-width: 640px) {
		.rot {
			padding: 22px 20px 18px;
		}
	}
	@media (scripting: none) {
		.nav {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.slide {
			transition: none;
		}
	}
</style>
