<!--
  The service template's "Vier Schritte. Ein Ansprechpartner."
  (.pg-sec#ablauf, the designs' .lg-steps.pb-steps): four cards, each with a
  small picture from the page's `visual` snippet that plays on hover and
  focus (the cards are focusable, as in the designs); on touch screens it
  plays while 60 % of the card is in view (class `play`). The pictures'
  rules select `:global(li.step:is(:hover, :focus-visible, .play))`. The
  number turns green as the card reveals (server-rendered green). The
  pictures are decorative.
-->
<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import type { StepsContent } from "./types";

	let {
		steps,
		id = "ablauf",
		visual,
	}: {
		steps: StepsContent;
		id?: string;
		/** The picture of step `index` (an SVG). */
		visual: Snippet<[number]>;
	} = $props();

	/** Touch screens: no hover, so a picture plays while its card is in view. */
	let touch = false;
	let playing = $state<boolean[]>([]);

	onMount(() => {
		touch = window.matchMedia("(hover: none)").matches;
	});
</script>

<section class="pg-sec stp" {id} aria-labelledby="ab-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="ab-h" eyebrow={steps.pill} heading={steps.h2}>
				{#snippet icon()}
					<path d="M3 10h14M13 6l4 4-4 4" />
				{/snippet}
			</SectionHead>
		</div>
		<ol class="steps">
			{#each steps.items as item, i (item.title)}
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<li
					class={["step rv", playing[i] && "play"]}
					tabindex="0"
					style:--d={`${i * 0.08}s`}
					{@attach inView({
						threshold: 0.6,
						onEnter: () => (playing[i] = touch),
						onLeave: () => (playing[i] = false),
					})}
				>
					<div class="sv-box" aria-hidden="true">{@render visual(i)}</div>
					<span class="n">{i + 1}</span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	/* The landing heading reset takes SectionHead's 18 px top margin. */
	.stp .head :global(h2) {
		margin-top: 18px;
	}
	.head {
		max-width: 760px;
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: 40px 0 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		position: relative;
	}
	.steps li {
		position: relative;
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 22px;
		outline: none;
	}
	.steps li:focus-visible {
		box-shadow: 0 0 0 2px var(--accent-deep);
	}
	/* The reveal's transition keeps the design's per-card delay. */
	ol.steps > li:global(.rv.rv-anim) {
		transition-delay: var(--d);
	}
	.n {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		font-size: 14px;
		font-weight: 600;
		transition:
			background 0.4s calc(var(--d) + 0.3s),
			color 0.4s calc(var(--d) + 0.3s);
	}
	li:global(.rv-wait) .n {
		background: var(--ink);
		color: #fff;
	}
	/* `.steps h3`: beats the landing reset of heading margins. */
	.steps h3 {
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 16px;
	}
	.steps p {
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 8px;
	}
	/* .pb-sv */
	.sv-box {
		height: 120px;
		margin: -6px -6px 18px;
		border-radius: 14px;
		background: #fff;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		overflow: hidden;
	}
	@media (max-width: 1040px) {
		.steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.steps {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sv-box :global(*) {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
