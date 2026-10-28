<!--
  "Jeder Hersteller. Ein Dashboard." (the design's .iq-ds, #iq-more): the
  heading and lead, then four light cards, each with its text and link and
  an animated picture below (a phone or a browser window, hidden from
  screen readers). Two columns, one below 820 px.
-->
<script lang="ts">
	import type { Component } from "svelte";
	import { dashboard } from "../content";
	import KeysPhone from "./KeysPhone.svelte";
	import LawCard from "./LawCard.svelte";
	import MergeDiagram from "./MergeDiagram.svelte";
	import ReadingPhone from "./ReadingPhone.svelte";

	const { reading, merge, law, keys } = dashboard.cards;
	const cards: {
		card: (typeof dashboard.cards)[keyof typeof dashboard.cards];
		frame: "ph" | "br";
		scene: Component;
	}[] = [
		{ card: reading, frame: "ph", scene: ReadingPhone },
		{ card: merge, frame: "br", scene: MergeDiagram },
		{ card: law, frame: "br", scene: LawCard },
		{ card: keys, frame: "ph", scene: KeysPhone },
	];
</script>

<section class="ds" aria-labelledby="iop-ds-h">
	<div class="wrap">
		<h2 class="h rv" id="iop-ds-h">
			{dashboard.h2[0]}<br />{dashboard.h2[1]}
		</h2>
		<p class="lead rv">{dashboard.lead}</p>
		<div class="dg">
			{#each cards as { card, frame, scene: Scene }, i (i)}
				<article class="dc rv" aria-labelledby="iop-ds-{i}">
					<div class="dt">
						<h3 id="iop-ds-{i}">{card.title[0]}<br />{card.title[1]}</h3>
						<p>{card.text}</p>
						<a href={card.href}
							>{dashboard.more}
							<svg
								width="14"
								height="14"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								stroke-width="1.6"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg
							></a
						>
					</div>
					<div class={["dm", frame]} aria-hidden="true"><Scene /></div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.ds {
		padding: 20px 0 120px;
	}
	/* The design's .uv-h; beats the landing heading reset (tokens.css). */
	.ds .h {
		font-size: clamp(32px, 4vw, 56px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1.05;
	}
	.lead {
		max-width: 640px;
		margin: 22px 0 0;
		font-size: 18px;
		line-height: 1.5;
		color: var(--mute);
	}
	.dg {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
		margin-top: clamp(36px, 6vw, 72px);
	}
	.dc {
		background: #eef1ef;
		color: #1e322d;
		border-radius: 22px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-height: 620px;
	}
	.dt {
		padding: clamp(26px, 3.4vw, 40px) clamp(24px, 3.4vw, 40px) 0;
	}
	.dc h3 {
		margin: 0;
		font-size: clamp(24px, 2.3vw, 30px);
		font-weight: 400;
		letter-spacing: -0.03em;
		line-height: 1.12;
	}
	.dt p {
		margin: 12px 0 0;
		max-width: 430px;
		font-size: 15.5px;
		line-height: 1.5;
		color: rgba(30, 50, 45, 0.68);
	}
	.dt a {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		margin-top: 20px;
		font-size: 15px;
		color: #1e322d;
		text-decoration: none;
	}
	.dt a svg {
		transition: translate 0.25s ease;
	}
	.dt a:hover svg {
		translate: 3px 0;
	}
	.dm {
		position: relative;
		flex: 1;
		min-height: 360px;
		margin-top: 28px;
	}
	@media (max-width: 820px) {
		.dg {
			grid-template-columns: 1fr;
		}
		.dc {
			min-height: 560px;
		}
	}
	@media (max-width: 560px) {
		.dc {
			min-height: 540px;
		}
		.lead {
			font-size: 16px;
		}
	}
</style>
