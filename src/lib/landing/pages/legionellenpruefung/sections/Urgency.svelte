<!--
  "Prüfung verpasst? Das kann teuer werden." (the design's dark .ur band):
  the duty, three risks, "Prüfung beauftragen" (→ /kontakt) and the three
  figure cards; the fine's card pulses. The cards' accent line grows as they
  reveal (server-rendered grown).
-->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { urgency } from "../content";
</script>

<section class="ur" aria-labelledby="ur-h">
	<div class="wrap g">
		<div class="t">
			<span class="k rv"
				><StrokeIcon
					><path d="M10 3l7.5 13h-15z" /><path
						d="M10 8.5v3.5M10 14.5h.01"
					/></StrokeIcon
				>{urgency.kicker}</span
			>
			<h2 class="rv" id="ur-h">
				{urgency.h2.text}<span>{urgency.h2.muted}</span>
			</h2>
			<p class="rv">{urgency.text}</p>
			<ul class="pl rv">
				{#each urgency.risks as risk (risk)}<li>{risk}</li>{/each}
			</ul>
			<a class="cta rv" href={urgency.cta.href}
				>{urgency.cta.text}<svg
					width="16"
					height="16"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"><path d="M3 10h14M13 6l4 4-4 4" /></svg
				></a
			>
			<small class="note rv">{urgency.note}</small>
		</div>
		<div class="cs">
			{#each urgency.cards as card (card.label)}
				<div class={["c rv", card.hot && "hot"]}>
					<span class="l">{card.label}</span>
					<b class="n">{card.value}</b>
					<span class="s">{card.sub}</span>
					{#if card.hot}<i class="pulse" aria-hidden="true"></i>{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.ur {
		background: var(--ink);
		color: #fff;
		padding: 104px 0;
	}
	.g {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: 64px;
		align-items: center;
	}
	.k {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		font-weight: 600;
		color: #ffb59b;
		background: rgba(232, 131, 90, 0.12);
		border: 1px solid rgba(232, 131, 90, 0.32);
		border-radius: 999px;
		padding: 7px 14px 7px 11px;
	}
	/* `.t h2`: beats the landing reset of heading margins. */
	.t h2 {
		font-size: clamp(34px, 4.4vw, 52px);
		line-height: 1.06;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin: 22px 0 0;
		color: #fff;
	}
	h2 span {
		color: var(--accent);
	}
	.t > p {
		font-size: 17.5px;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.72);
		margin: 20px 0 0;
		max-width: 560px;
	}
	.pl {
		list-style: none;
		padding: 0;
		margin: 22px 0 0;
		display: grid;
		gap: 10px;
	}
	.pl li {
		position: relative;
		padding-left: 26px;
		font-size: 15.5px;
		color: rgba(255, 255, 255, 0.86);
	}
	.pl li::before {
		content: "";
		position: absolute;
		left: 2px;
		top: 0.5em;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid var(--accent);
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 30px;
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
		font-size: 16.5px;
		padding: 15px 22px;
		border-radius: 12px;
		text-decoration: none;
		transition: box-shadow 0.3s;
	}
	.cta svg {
		transition: transform 0.25s;
	}
	.cta:hover {
		box-shadow: 0 14px 34px -14px rgba(138, 214, 143, 0.7);
	}
	.cta:hover svg {
		transform: translateX(3px);
	}
	.note {
		display: block;
		margin-top: 16px;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.45);
	}
	.cs {
		display: grid;
		gap: 12px;
	}
	.c {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 18px;
		padding: 22px 24px;
		overflow: hidden;
	}
	.c.hot {
		background: rgba(232, 131, 90, 0.1);
		border-color: rgba(232, 131, 90, 0.38);
	}
	.l {
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.6);
		font-weight: 500;
	}
	.n {
		font-size: clamp(34px, 3.6vw, 46px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.05;
		margin-top: 6px;
		font-variant-numeric: tabular-nums;
		color: #fff;
	}
	.c.hot .n {
		color: #ffb59b;
	}
	.s {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.62);
		margin-top: 6px;
	}
	.pulse {
		position: absolute;
		right: 22px;
		top: 24px;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #e8835a;
	}
	.pulse::after {
		content: "";
		position: absolute;
		inset: -5px;
		border-radius: 50%;
		border: 2px solid rgba(232, 131, 90, 0.6);
		animation: ur-p 1.8s ease-out infinite;
	}
	@keyframes ur-p {
		from {
			transform: scale(0.6);
			opacity: 1;
		}
		to {
			transform: scale(1.7);
			opacity: 0;
		}
	}
	/* The accent line: grown, and from 0 while the card waits to reveal. */
	.c::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: var(--accent);
		transform-origin: top;
		transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s;
	}
	.c.hot::before {
		background: #e8835a;
	}
	.c:global(.rv-wait)::before {
		transform: scaleY(0);
	}
	.cs .c:nth-child(2):global(.rv-anim) {
		transition-delay: 0.1s;
	}
	.cs .c:nth-child(3):global(.rv-anim) {
		transition-delay: 0.2s;
	}
	@media (max-width: 900px) {
		.ur {
			padding: 72px 0;
		}
		.g {
			grid-template-columns: minmax(0, 1fr);
			gap: 36px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pulse::after {
			animation: none;
		}
	}
</style>
