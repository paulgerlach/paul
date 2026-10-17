<!--
  "Drei Schritte": WAI-ARIA tabs (vertical tablist, automatic activation) with
  the step texts on the left and a picture with its example chip on the
  right. The server renders step 1. Auto-advance: plan 03 §3.1.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import consultation from "$lib/assets/landing/vorgehen/consultation.webp?enhanced";
	import dashboard from "$lib/assets/landing/vorgehen/dashboard.webp?enhanced";
	import installer from "$lib/assets/landing/vorgehen/installer.webp?enhanced";
	import Head from "../components/Head.svelte";
	import { steps } from "../content";

	const photos = [consultation, installer, dashboard];
	const count = steps.items.length;

	let active = $state(0);

	function select(i: number, focus = false) {
		active = (i + count) % count;
		if (focus) document.getElementById(`vg-tab-${active}`)?.focus();
	}

	function onkeydown(e: KeyboardEvent) {
		const next: Record<string, number> = {
			ArrowDown: active + 1,
			ArrowRight: active + 1,
			ArrowUp: active - 1,
			ArrowLeft: active - 1,
			Home: 0,
			End: count - 1,
		};
		if (!(e.key in next)) return;
		e.preventDefault();
		select(next[e.key], true);
	}
</script>

<section class="sec" aria-labelledby="vg-steps-h">
	<div class="wrap">
		<Head id="vg-steps-h" eyebrow={steps.eyebrow} title={steps.h2} center />
		<div class="tabs rv">
			<div>
				<div
					class="list"
					role="tablist"
					aria-orientation="vertical"
					aria-labelledby="vg-steps-h"
					tabindex="-1"
					{onkeydown}
				>
					{#each steps.items as step, i (step.title)}
						<button
							type="button"
							role="tab"
							id="vg-tab-{i}"
							aria-controls="vg-panel-{i}"
							aria-selected={i === active}
							tabindex={i === active ? 0 : -1}
							class={["tab", i === active && "on"]}
							onclick={() => select(i)}
						>
							<span class="n">{String(i + 1).padStart(2, "0")}</span
							>{step.title}
						</button>
					{/each}
				</div>
				<div class="texts">
					{#each steps.items as step, i (step.title)}
						<div
							class={["tx", i === active && "on"]}
							role="tabpanel"
							id="vg-panel-{i}"
							aria-labelledby="vg-tab-{i}"
							inert={i !== active}
						>
							<p>{step.text}</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="pics" aria-hidden="true">
				{#each steps.items as step, i (step.title)}
					<figure class={["pic", i === active && "on"]}>
						<Image
							src={photos[i]}
							alt=""
							sizes="(max-width: 980px) 100vw, 720px"
						/>
						<figcaption class="chip">
							<b>{step.chip.title}</b><small>{step.chip.sub}</small>
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.sec {
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
	.chip small {
		color: var(--muted);
		font-size: inherit;
	}
	@media (max-width: 980px) {
		.tabs {
			grid-template-columns: minmax(0, 1fr);
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
