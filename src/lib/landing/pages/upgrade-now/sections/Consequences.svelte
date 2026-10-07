<!--
  "Was passiert, wenn nicht umgerüstet ist": three cards with big numbers
  (counting up when in view; SSR renders the final values) and the WEG note.
-->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import SectionHead from "../components/SectionHead.svelte";
	import { consequences } from "../content";
	import { getDeadlineClock } from "../clock.svelte";

	const clock = getDeadlineClock();
</script>

<section class="cons" aria-labelledby="cons-h">
	<div class="wrap">
		<SectionHead
			id="cons-h"
			eyebrow={clock.expired
				? consequences.eyebrowExpired
				: consequences.eyebrow}
			heading={consequences.h2}
		>
			{#snippet icon()}
				<path d="M10 3l7.5 13h-15z" /><path d="M10 8v4M10 14.3v.1" />
			{/snippet}
		</SectionHead>
		<div class="cards">
			{#each consequences.cards as card (card.title)}
				<article class={["card rv", card.hot && "hot"]}>
					<div class="big">
						{#if card.prefix}<i>{card.prefix}</i>{/if}<b
							{@attach countUp({
								to: card.value,
								duration: 1100,
								viewDelay: 0,
								threshold: 0.15,
							})}>{card.value}</b
						><i>{card.suffix}</i>
					</div>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
					<small>{card.source}</small>
				</article>
			{/each}
		</div>
		<div class="weg rv">
			<svg
				width="16"
				height="16"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				><circle cx="8" cy="7" r="3" /><path
					d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
				/></svg
			>
			<p><b>{consequences.weg.lead}</b> {consequences.weg.text}</p>
		</div>
	</div>
</section>

<style>
	.cons {
		background: var(--bg);
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
		margin-top: 48px;
	}
	.card {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 30px 28px 26px;
		display: flex;
		flex-direction: column;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.card:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px -24px rgba(30, 50, 45, 0.35);
	}
	.card.hot {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.big {
		display: flex;
		align-items: baseline;
		font-size: clamp(64px, 7vw, 96px);
		font-weight: 500;
		letter-spacing: -0.05em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.big i {
		font-style: normal;
		font-size: 0.5em;
		margin-left: 4px;
		color: var(--faint);
	}
	.big i:first-child {
		margin: 0 4px 0 0;
	}
	.hot .big b {
		color: var(--accent);
	}
	.hot .big i {
		color: rgba(255, 255, 255, 0.5);
	}
	h3 {
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.015em;
		margin-top: 22px;
	}
	.card p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.55;
		margin-top: 10px;
		flex: 1;
	}
	.hot p {
		color: rgba(255, 255, 255, 0.72);
	}
	small {
		display: block;
		margin-top: 20px;
		font-size: 12.5px;
		color: var(--faint);
		font-weight: 500;
	}
	.hot small {
		color: rgba(255, 255, 255, 0.45);
	}
	.weg {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		margin-top: 20px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 18px 22px;
	}
	.weg svg {
		width: 20px;
		height: 20px;
		flex: none;
		margin-top: 2px;
		color: var(--ok);
	}
	.weg p {
		font-size: 15px;
		color: var(--muted);
		line-height: 1.5;
	}
	.weg b {
		color: var(--ink);
	}
	@media (max-width: 1040px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
