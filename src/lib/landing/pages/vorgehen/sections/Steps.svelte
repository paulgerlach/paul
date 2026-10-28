<!--
  "Drei Schritte": WAI-ARIA tabs (vertical tablist, automatic activation) with
  the step texts on the left and a picture with its example chip on the
  right; step 3's picture is the dashboard demo (`StepsDemo`), which plays
  each time the step shows. The server renders step 1.

  Auto-advance through the shared `AutoTabs`: every 6 s (8.5 s on step 3) while the block is in
  view, the tab is visible and the pointer and focus are outside it; choosing a
  step stops it for good. The bar shows the running interval.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { AutoTabs } from "$lib/landing/autoTabs.svelte";
	import consultation from "$lib/assets/landing/vorgehen/consultation.webp?enhanced";
	import installer from "$lib/assets/landing/vorgehen/installer.webp?enhanced";
	import Head from "../components/Head.svelte";
	import StepsDemo from "./StepsDemo.svelte";
	import { steps } from "../content";

	const photos = [consultation, installer];
	const count = steps.items.length;

	const tabs = new AutoTabs({
		count,
		intervalMs: steps.intervalMs,
		tabId: (i) => `vg-tab-${i}`,
	});
</script>

<section class="blk" aria-labelledby="vg-steps-h">
	<div class="wrap">
		<Head id="vg-steps-h" eyebrow={steps.eyebrow} title={steps.h2} center />
		<div class="tabs rv" {@attach tabs.attach}>
			<div>
				<div
					class="list"
					role="tablist"
					aria-orientation="vertical"
					aria-labelledby="vg-steps-h"
					tabindex="-1"
					onkeydown={tabs.onkeydown}
				>
					{#each steps.items as step, i (step.title)}
						<button
							type="button"
							role="tab"
							id="vg-tab-{i}"
							aria-controls="vg-panel-{i}"
							aria-selected={i === tabs.active}
							tabindex={i === tabs.active ? 0 : -1}
							class={["tab", i === tabs.active && "on"]}
							onclick={() => tabs.select(i)}
						>
							<span class="n">{String(i + 1).padStart(2, "0")}</span
							>{step.title}
						</button>
					{/each}
				</div>
				<div class="texts">
					{#each steps.items as step, i (step.title)}
						<div
							class={["tx", i === tabs.active && "on"]}
							role="tabpanel"
							id="vg-panel-{i}"
							aria-labelledby="vg-tab-{i}"
							inert={i !== tabs.active}
						>
							<p>{step.text}</p>
						</div>
					{/each}
				</div>
			</div>
			<div
				class="pics"
				aria-hidden="true"
				style:--interval="{tabs.intervalOf(tabs.active)}ms"
			>
				{#each steps.items as step, i (step.title)}
					<figure class={["pic", i === tabs.active && "on"]}>
						{#if step.chip}
							<Image
								src={photos[i]}
								alt=""
								sizes="(max-width: 980px) 100vw, 720px"
							/>
							<figcaption class="chip">
								<b>{step.chip.title}</b><small>{step.chip.sub}</small>
							</figcaption>
						{:else}
							<StepsDemo active={i === tabs.active} />
						{/if}
					</figure>
				{/each}
				<span class="bar">
					{#if tabs.running}
						{#key tabs.active}<i></i>{/key}
					{/if}
				</span>
			</div>
		</div>
	</div>
</section>

<style>
	.blk {
		padding-top: clamp(72px, 9vw, 128px);
	}
	.wrap {
		max-width: 1280px;
	}
	.tabs {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: clamp(24px, 4vw, 64px);
		align-items: center;
		margin-top: 48px;
	}
	.list {
		display: grid;
		gap: 4px;
	}
	.list:focus {
		outline: none;
	}
	.tab {
		display: flex;
		align-items: center;
		gap: 14px;
		width: 100%;
		border: 0;
		background: none;
		padding: 9px 0;
		font: inherit;
		font-size: clamp(17px, 1.6vw, 20px);
		color: var(--faint);
		text-align: left;
		cursor: pointer;
		transition: color 0.3s;
	}
	.tab:hover {
		color: var(--muted);
	}
	.tab.on {
		color: var(--ink);
	}
	.n {
		font-family: var(--mono);
		font-size: 11.5px;
		border-radius: 6px;
		padding: 3px 6px;
		background: var(--soft);
		color: var(--muted);
		transition:
			background 0.3s,
			color 0.3s;
	}
	.tab.on .n {
		background: var(--accent);
		color: var(--ink);
	}
	/* All texts in one grid cell: the box is as tall as the longest. */
	.texts {
		display: grid;
		margin-top: 22px;
		min-height: 120px;
	}
	/* The design's box is 120 px whatever the text (it's absolute there), so
	   the column centres the same; below 980 px the text would run into the
	   picture, so the box grows there. */
	@media (min-width: 981px) {
		.texts {
			height: 120px;
		}
	}
	.tx {
		grid-area: 1 / 1;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.tx.on {
		opacity: 1;
		transform: none;
	}
	.tx p {
		font-size: 16px;
		line-height: 1.6;
		color: var(--muted);
		max-width: 44ch;
	}
	.pics {
		position: relative;
		border-radius: 22px;
		overflow: hidden;
		aspect-ratio: 4/3;
		background: var(--soft);
	}
	.pic {
		position: absolute;
		inset: 0;
		margin: 0;
		opacity: 0;
		transition: opacity 0.7s ease;
	}
	.pic.on {
		opacity: 1;
	}
	.pic :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.05);
		transition: transform 6s linear;
	}
	.pic.on :global(img) {
		transform: scale(1);
	}
	.chip {
		position: absolute;
		right: 22px;
		bottom: 30px;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(8px);
		border-radius: 12px;
		padding: 12px 16px;
		font-size: 14px;
		line-height: 1.4;
		box-shadow: 0 20px 40px -24px rgba(30, 50, 45, 0.5);
		transform: translateY(8px);
		opacity: 0;
		transition:
			opacity 0.5s 0.25s,
			transform 0.5s 0.25s;
		max-width: 70%;
	}
	.pic.on .chip {
		opacity: 1;
		transform: none;
	}
	.chip b {
		display: block;
		font-weight: 600;
	}
	/* The browser's own size of a <small> (the preflight sets 80 %). */
	.chip small {
		color: var(--muted);
		font-size: smaller;
	}
	.bar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: rgba(255, 255, 255, 0.4);
	}
	.bar i {
		display: block;
		height: 100%;
		width: 0;
		background: var(--accent);
		animation: bar var(--interval) linear forwards;
	}
	@keyframes bar {
		to {
			width: 100%;
		}
	}
	@media (max-width: 980px) {
		.tabs {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	/* The design's `.ar-tvw:has(.vd)`: taller for the dashboard demo. */
	@media (max-width: 640px) {
		.pics {
			aspect-ratio: 4/5;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tx,
		.pic,
		.chip,
		.pic :global(img) {
			transition: none;
			transform: none;
		}
	}
</style>
