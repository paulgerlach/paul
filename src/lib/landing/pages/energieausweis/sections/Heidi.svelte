<!--
  "Die Verbräuche haben Sie schon." (.pg-sec.alt, .ea-heidi): the dark card
  with "Zum Dashboard →" and three yearly bars plus the 36-month box. The
  server renders the bars grown; below the fold on load (and with motion)
  they start at 0 and grow when the card comes into view.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { heidi } from "../content";

	let grown = $state(true);
</script>

<section class="pg-sec alt" aria-labelledby="ea-hd-h">
	<div class="wrap">
		<div
			class={["card rv", grown && "in"]}
			{@attach enterView({
				prepare: () => (grown = false),
				play: () => {
					grown = true;
				},
				threshold: 0.15,
			})}
		>
			<div>
				<span class="pill"
					><StrokeIcon><path d="M3 17h14M6 14V9M10 14V5M14 14v-3" /></StrokeIcon
					>{heidi.pill}</span
				>
				<h2 id="ea-hd-h">{heidi.h2}</h2>
				<p>{heidi.text}</p>
				<ArrowLink href={heidi.cta.href} label={heidi.cta.text} class="go" />
			</div>
			<div class="yrs" aria-hidden="true">
				{#each heidi.years as year (year.label)}
					<div class="yr">
						<span>{year.label}</span>
						<i style:--h={`${year.height}%`}></i>
					</div>
				{/each}
				<div class="yr sum">
					<span>{heidi.sum}</span>
					<b><Check /></b>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.card {
		background: var(--ink);
		color: #fff;
		border-radius: 24px;
		padding: 48px clamp(24px, 5vw, 56px);
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 40px;
		align-items: center;
	}
	/* .pg-pill-d */
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		padding: 7px 14px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.86);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
		transform-origin: 50% 50%;
		transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		transform: scale(1.12);
	}
	/* `.card h2`: beats the landing reset of heading margins. */
	.card h2 {
		font-size: clamp(28px, 3.2vw, 42px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 18px;
		line-height: 1.1;
	}
	.card p {
		color: rgba(255, 255, 255, 0.72);
		font-size: 17px;
		line-height: 1.5;
		margin-top: 14px;
		max-width: 48ch;
	}
	.card :global(a.go) {
		margin-top: 24px;
	}
	.yrs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		align-items: end;
		height: 200px;
	}
	.yr {
		height: 100%;
		display: flex;
		flex-direction: column-reverse;
		align-items: stretch;
		gap: 8px;
	}
	.yr span {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.6);
		text-align: center;
	}
	.yr i {
		display: block;
		height: 0;
		background: rgba(138, 214, 143, 0.55);
		border-radius: 8px 8px 0 0;
		transition: height 1s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.in .yr i {
		height: var(--h);
	}
	.sum b {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1.5px dashed rgba(138, 214, 143, 0.6);
		border-radius: 10px;
		opacity: 0;
		transition: opacity 0.5s 1s;
	}
	.sum b :global(svg) {
		width: 22px;
		height: 18px;
	}
	.sum b :global(svg path) {
		stroke: var(--accent);
	}
	.in .sum b {
		opacity: 1;
	}
	@media (max-width: 1040px) {
		.card {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.card {
			padding: 36px 22px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
