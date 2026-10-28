<!--
  "Sechs Geräte. Ein System." (the design's .gd-sec, #gd-css): a light band
  with WAI-ARIA tabs (vertical list with a thumbnail per device; a scrolling
  row below 980 px) beside the stage, where the chosen device's photo floats
  and its text and three points come in. Every panel is in the HTML; the
  inactive ones are hidden with `visibility`, so they fade. The server
  renders the first device.

  Auto-advance through the shared `AutoTabs`: every 6 s while 35 % of the
  block is in view, the browser tab is visible and the pointer and focus are
  outside it (the design doesn't pause; /vorgehen's steps do); choosing a
  device stops it for good. The active tab's bar shows the running interval.
  Below 980 px the tab row scrolls to the active tab.
-->
<script lang="ts">
	import gateway from "$lib/assets/landing/funkzaehler/gateway.webp?enhanced";
	import heizkostenverteiler from "$lib/assets/landing/funkzaehler/heizkostenverteiler.webp?enhanced";
	import kaltwasserzaehler from "$lib/assets/landing/funkzaehler/kaltwasserzaehler.webp?enhanced";
	import rauchwarnmelder from "$lib/assets/landing/funkzaehler/rauchwarnmelder.webp?enhanced";
	import waermemengenzaehler from "$lib/assets/landing/funkzaehler/waermemengenzaehler.webp?enhanced";
	import warmwasserzaehler from "$lib/assets/landing/funkzaehler/warmwasserzaehler.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { AutoTabs } from "$lib/landing/autoTabs.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "$lib/landing/sections/uv/Icon.svelte";
	import { devices } from "../content";

	const photos = {
		heizkostenverteiler,
		waermemengenzaehler,
		kaltwasserzaehler,
		warmwasserzaehler,
		rauchwarnmelder,
		gateway,
	};

	const tabs = new AutoTabs({
		count: devices.items.length,
		intervalMs: devices.intervalMs,
		tabId: (i) => `fz-gd-tab-${i}`,
	});

	let list: HTMLElement;

	// The design's set(): below 980 px the row scrolls the new tab into view.
	// Not on mount, where the first tab is already in place.
	let mounted = false;
	$effect(() => {
		const tab = document.getElementById(`fz-gd-tab-${tabs.active}`);
		if (!mounted) {
			mounted = true;
			return;
		}
		if (!tab || innerWidth >= 980) return;
		list.scrollTo({
			left: tab.offsetLeft - 16,
			behavior: prefersReducedMotion() ? "auto" : "smooth",
		});
	});
</script>

<section class="gd-sec" id="geraete" aria-labelledby="fz-gd-h">
	<div class="wrap">
		<div class="gd-head">
			<span class="gd-pill rv"><Icon name="meter" />{devices.pill}</span>
			<h2 class="gd-h rv" id="fz-gd-h">{devices.h2}</h2>
			<p class="gd-lead rv">{devices.lead}</p>
		</div>
		<div
			class="gd rv"
			style:--gd-interval="{devices.intervalMs}ms"
			{@attach tabs.attach}
		>
			<div
				class="gd-tl"
				role="tablist"
				aria-orientation="vertical"
				aria-label={devices.label}
				tabindex="-1"
				onkeydown={tabs.onkeydown}
				bind:this={list}
			>
				{#each devices.items as device, i (device.key)}
					<button
						type="button"
						role="tab"
						id="fz-gd-tab-{i}"
						aria-controls="fz-gd-panel-{i}"
						aria-selected={i === tabs.active}
						tabindex={i === tabs.active ? 0 : -1}
						class={["gd-t", i === tabs.active && "on"]}
						onclick={() => tabs.select(i)}
					>
						<span class="gd-th"><Image src={photos[device.key]} alt="" /></span>
						<span><small>{device.category}</small><b>{device.name}</b></span>
						{#if i === tabs.active && tabs.running}
							<i class="gd-pr"></i>
						{/if}
					</button>
				{/each}
			</div>
			<div class="gd-st">
				{#each devices.items as device, i (device.key)}
					<div
						class={["gd-p", i === tabs.active && "on"]}
						role="tabpanel"
						id="fz-gd-panel-{i}"
						aria-labelledby="fz-gd-tab-{i}"
					>
						<div class="gd-img">
							<Image src={photos[device.key]} alt="{device.name} von Heidi" />
						</div>
						<div class="gd-tx">
							<span class="gd-c">{device.category}</span>
							<h3>{device.name}</h3>
							<p>{device.text}</p>
							<ul>
								{#each device.points as point (point)}
									<li>
										<svg viewBox="0 0 12 10" width="10" aria-hidden="true"
											><path
												d="M1 5l3.5 3.5L11 1"
												stroke="#1E322D"
												stroke-width="2"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round"
											/></svg
										>{point}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.gd-sec {
		padding: clamp(72px, 9vw, 120px) 0;
		background: #f6f7f6;
		color: var(--ink);
	}
	.gd-head {
		text-align: center;
		max-width: 720px;
		margin: 0 auto;
	}
	/* The design's .dm-pill */
	.gd-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.gd-pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.gd-pill:hover :global(svg) {
		color: var(--ok);
		transform: scale(1.12);
	}
	/* The design's .uv-h; the page's #hs-css sizes it below 1040 px */
	.gd-head .gd-h {
		margin-top: 16px;
		font-size: clamp(32px, 4vw, 56px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1.05;
		color: var(--ink);
	}
	.gd-lead {
		color: #5b6b66;
		font-size: 17px;
		line-height: 1.55;
		margin: 14px auto 0;
		max-width: 52ch;
	}

	.gd {
		display: grid;
		grid-template-columns: 300px minmax(0, 1fr);
		gap: 16px;
		margin-top: 48px;
	}
	.gd-tl {
		display: grid;
		gap: 6px;
		align-content: start;
	}
	.gd-tl:focus {
		outline: none;
	}
	.gd-t {
		position: relative;
		overflow: hidden;
		display: grid;
		grid-template-columns: 52px 1fr;
		gap: 12px;
		align-items: center;
		text-align: left;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 14px;
		padding: 8px 12px 8px 8px;
		font: inherit;
		color: var(--ink);
		cursor: pointer;
		transition:
			border-color 0.2s,
			box-shadow 0.25s,
			transform 0.2s;
	}
	.gd-t:hover {
		border-color: #c9d2ce;
	}
	.gd-t.on {
		border-color: var(--ink);
		box-shadow: 0 14px 30px -20px rgba(30, 50, 45, 0.45);
	}
	.gd-th {
		width: 52px;
		height: 52px;
		border-radius: 10px;
		background: #eff2f0;
		display: grid;
		place-items: center;
		overflow: hidden;
	}
	.gd-th :global(img) {
		width: auto;
		height: auto;
		max-width: 40px;
		max-height: 40px;
		object-fit: contain;
		filter: drop-shadow(0 3px 4px rgba(30, 50, 45, 0.22));
	}
	.gd-t small {
		display: block;
		font-size: 11.5px;
		color: #5b6b66;
	}
	.gd-t b {
		display: block;
		font-size: 15px;
		font-weight: 600;
		color: var(--ink);
	}
	.gd-pr {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 2px;
		width: 0;
		background: var(--accent);
		animation: gdp var(--gd-interval) linear forwards;
	}
	@keyframes gdp {
		to {
			width: 100%;
		}
	}

	.gd-st {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 24px;
		min-height: 520px;
		overflow: hidden;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.3);
	}
	.gd-p {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		align-items: center;
		gap: clamp(24px, 3.5vw, 48px);
		padding: clamp(20px, 2.4vw, 28px) clamp(24px, 3.5vw, 48px)
			clamp(20px, 2.4vw, 28px) clamp(20px, 2.4vw, 28px);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.45s,
			visibility 0s 0.45s;
	}
	.gd-p.on {
		opacity: 1;
		visibility: visible;
		transition: opacity 0.45s;
	}
	.gd-img {
		position: relative;
		display: grid;
		place-items: end center;
		align-content: end;
		height: 100%;
		min-height: 400px;
		background: #eff2f0;
		border-radius: 20px;
		padding: 40px 32px 64px;
		isolation: isolate;
	}
	.gd-img::before {
		content: "";
		position: absolute;
		left: 50%;
		bottom: 50px;
		width: 62%;
		height: 20px;
		transform: translateX(-50%) scaleX(0.7);
		border-radius: 50%;
		background: rgba(30, 50, 45, 0.28);
		filter: blur(14px);
		opacity: 0;
		z-index: -1;
		transition:
			transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.6s;
	}
	.gd-p.on .gd-img::before {
		opacity: 1;
		transform: translateX(-50%);
	}
	.gd-img :global(img) {
		position: relative;
		width: auto;
		height: auto;
		max-width: 88%;
		max-height: 330px;
		object-fit: contain;
		filter: drop-shadow(0 22px 26px rgba(30, 50, 45, 0.22))
			drop-shadow(0 3px 6px rgba(30, 50, 45, 0.14));
		transform: translateY(16px) scale(0.95);
		opacity: 0;
		transition:
			transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.5s;
	}
	.gd-p.on .gd-img :global(img) {
		transform: none;
		opacity: 1;
		animation: gd-float 6s ease-in-out 0.9s infinite;
	}
	@keyframes gd-float {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 -6px;
		}
	}
	.gd-c {
		display: inline-block;
		font-size: 12px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
	}
	.gd-tx h3 {
		font-size: clamp(26px, 2.6vw, 36px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin: 14px 0 0;
		color: var(--ink);
	}
	.gd-tx p {
		color: #5b6b66;
		font-size: 16px;
		line-height: 1.6;
		margin: 12px 0 0;
	}
	.gd-tx ul {
		list-style: none;
		margin: 20px 0 0;
		padding: 0;
		display: grid;
		gap: 9px;
	}
	.gd-tx li {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 15px;
		color: var(--ink);
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	.gd-p.on li {
		opacity: 1;
		transform: none;
	}
	.gd-p.on li:nth-child(1) {
		transition-delay: 0.25s;
	}
	.gd-p.on li:nth-child(2) {
		transition-delay: 0.35s;
	}
	.gd-p.on li:nth-child(3) {
		transition-delay: 0.45s;
	}
	.gd-tx li svg {
		width: 20px;
		height: 20px;
		padding: 4px;
		border-radius: 50%;
		background: var(--accent);
		flex: none;
	}

	@media (max-width: 980px) {
		.gd {
			grid-template-columns: 1fr;
		}
		.gd-tl {
			display: flex;
			overflow-x: auto;
			padding-bottom: 4px;
			scrollbar-width: none;
		}
		.gd-tl::-webkit-scrollbar {
			display: none;
		}
		.gd-t {
			flex: none;
			grid-template-columns: 40px auto;
			padding: 6px 12px 6px 6px;
		}
		.gd-th {
			width: 40px;
			height: 40px;
		}
		.gd-th :global(img) {
			max-width: 30px;
			max-height: 30px;
		}
		.gd-st {
			min-height: 0;
			display: grid;
		}
		.gd-p {
			position: relative;
			grid-area: 1/1;
			grid-template-columns: 1fr;
			gap: 12px;
		}
		.gd-img {
			min-height: 260px;
			padding: 28px 24px 44px;
		}
		.gd-img::before {
			bottom: 32px;
		}
		.gd-img :global(img) {
			max-height: 220px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gd *,
		.gd :global(img),
		.gd-pill :global(svg) {
			transition: none !important;
			animation: none !important;
		}
		.gd-pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
