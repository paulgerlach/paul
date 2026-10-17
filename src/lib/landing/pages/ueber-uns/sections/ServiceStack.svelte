<!--
  "Was Heidi übernimmt": the five services light up one after another, then
  the "Ein Partner für alles" row slides in with a confetti burst. CSS
  keyframes run while the card has `.play` (playOnView); without it the
  styles are the final state, so SSR, no-JS and reduced motion show every
  item ticked and nothing flashes above the fold.
-->
<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { playOnView, replay } from "$lib/landing/attachments/playOnView";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { burst } from "$lib/landing/confetti";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { services, type ServiceIcon } from "../content";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";

	let card: HTMLElement;
	let one: HTMLElement;
	let canvas: HTMLCanvasElement;
	let stopConfetti = () => {};

	// The replay button only works with JS and motion, so it appears after mount.
	let canReplay = $state(false);
	onMount(() => {
		canReplay = !prefersReducedMotion();
	});

	function onRowStart(event: AnimationEvent) {
		if (event.target !== one) return;
		stopConfetti();
		const host = card.getBoundingClientRect();
		const o = one.getBoundingClientRect();
		stopConfetti = burst(
			canvas,
			{ width: host.width, height: host.height },
			{
				x: o.left - host.left + o.width / 2,
				y: o.top - host.top + o.height / 2,
				width: 0,
			},
			{
				count: 120,
				speed: [2.6, 4.2],
				angle: 1.2,
				gravity: 0.06,
				maxFall: 1.2,
				fadeAfter: 3400,
				fadeMs: 1000,
				maxTime: 4600,
				wobble: [420, 0.5],
				spin: 0.14,
			},
		);
	}

	onDestroy(() => stopConfetti());
</script>

{#snippet icon(name: ServiceIcon)}
	<StrokeIcon>
		{#if name === "meter"}
			<rect x="5" y="2.5" width="10" height="15" rx="2" /><path
				d="M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4"
			/>
		{:else if name === "install"}
			<path
				d="M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z"
			/>
		{:else if name === "radio"}
			<path
				d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
			/><circle cx="10" cy="16" r=".8" fill="currentColor" />
		{:else if name === "bell"}
			<path
				d="M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0"
			/>
		{:else}
			<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
				d="M12 2.5V6h3.5M8 10h5M8 13h5"
			/>
		{/if}
	</StrokeIcon>
{/snippet}

<div
	class="stack rv"
	role="group"
	aria-label={services.label}
	bind:this={card}
	{@attach playOnView({ threshold: 0.3 })}
>
	<div class="sh">
		<span>{services.title}</span>
		{#if canReplay}
			<button
				type="button"
				class="replay"
				aria-label={services.replay}
				onclick={() => replay(card)}
			>
				<StrokeIcon
					><path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" /></StrokeIcon
				>
			</button>
		{/if}
	</div>
	<ol>
		{#each services.items as item, i (item.title)}
			<li style:--i={i}>
				<span class="ic">{@render icon(item.icon)}</span>
				<span><b>{item.title}</b><small>{item.sub}</small></span>
				<em><Check /></em>
			</li>
		{/each}
	</ol>
	<div class="one" bind:this={one} onanimationstart={onRowStart}>
		<span class="mk">
			<svg viewBox="0 0 14 14" aria-hidden="true">
				<rect x="1" y="2" width="3" height="10" rx="1.5" fill="#1E322D" />
				<rect x="5.5" y="2" width="3" height="10" rx="1.5" fill="#1E322D" />
				<rect x="10" y="2" width="3" height="10" rx="1.5" fill="#1E322D" />
			</svg>
		</span>
		<span><b>{services.one.title}</b><small>{services.one.sub}</small></span>
	</div>
	<canvas class="cf" bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.stack {
		--step: 420ms;
		--start: 300ms;
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
		padding: 20px;
		overflow: hidden;
	}
	.sh {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 44px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
		padding: 2px 4px 12px;
	}
	.replay {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 8px;
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		cursor: pointer;
		color: var(--muted);
	}
	.replay :global(svg) {
		width: 14px;
		height: 14px;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	li {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr) 24px;
		gap: 12px;
		align-items: center;
		padding: 11px 12px;
		border: 1px solid var(--hair);
		border-radius: 14px;
		background: #fff;
	}
	.ic {
		width: 38px;
		height: 38px;
		border-radius: 11px;
		background: var(--bg);
		display: grid;
		place-items: center;
	}
	.ic :global(svg) {
		width: 18px;
		height: 18px;
	}
	li b {
		display: block;
		font-size: 15px;
		font-weight: 600;
	}
	li small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 1px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	em {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
	}
	em :global(svg) {
		width: 10px;
	}
	.one {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 12px;
		padding: 16px;
		border-radius: 16px;
		background: var(--ink);
		color: #fff;
	}
	.mk {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: #fff;
		display: grid;
		place-items: center;
		flex: none;
	}
	.mk svg {
		width: 22px;
		height: 19px;
	}
	.one b {
		display: block;
		font-size: 16px;
	}
	.one small {
		display: block;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.7);
	}
	.cf {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 5;
	}

	/* The animation, while `.play` is set. */
	.stack:global(.play) li {
		animation: item-on 0.45s calc(var(--start) + var(--i) * var(--step)) both;
	}
	.stack:global(.play) em {
		animation: check-bg 0.3s calc(var(--start) + var(--i) * var(--step)) both;
	}
	.stack:global(.play) em :global(svg) {
		animation: check-pop 0.35s cubic-bezier(0.3, 1.6, 0.5, 1)
			calc(var(--start) + var(--i) * var(--step)) both;
	}
	.stack:global(.play) .one {
		animation: one-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)
			calc(var(--start) + 5 * var(--step) + 250ms) both;
	}
	@keyframes item-on {
		from {
			opacity: 0.35;
		}
	}
	@keyframes check-bg {
		from {
			background: #eef1ef;
		}
	}
	@keyframes check-pop {
		from {
			opacity: 0;
			transform: scale(0.4);
		}
	}
	@keyframes one-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	@media (max-width: 640px) {
		li small {
			white-space: normal;
		}
	}
</style>
