<!--
  "Von der Funkablesung zur Kennzahl. Automatisch." (`.aw-sec` + `.af`): the
  centred head and three cards with their tickers, which rise in once when
  their card scrolls into view.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Icon from "$lib/landing/pages/dashboard/components/Icon.svelte";
	import Head from "../components/Head.svelte";
	import { steps } from "../content";

	let shown = $state(steps.cards.map(() => true));
	const entrance = (i: number) =>
		enterView({
			threshold: 0.4,
			prepare: () => (shown[i] = false),
			play: () => {
				shown[i] = true;
			},
		});
</script>

<section class="sec aw-sec" aria-labelledby="af-h">
	<Head id="af-h" pill={steps.pill} h2={steps.h2} lead={steps.lead} />
	<div class="wrap">
		<div class="af">
			{#each steps.cards as card, i (card.n)}
				<article
					class={["af-c rv", shown[i] && "in"]}
					style:--i={i}
					{@attach entrance(i)}
				>
					<span class="af-n" aria-hidden="true">{card.n}</span>
					<span class="af-ic"><Icon name={card.icon} /></span>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
					<div class="af-tk">
						{#each card.tickers as t (t.text)}
							<span class={[t.warn && "w"]}>{t.text}</span>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.aw-sec {
		padding: clamp(80px, 9vw, 120px) 0;
	}
	.af {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
		text-align: left;
		position: relative;
	}
	.af-c {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px;
	}
	.af-n {
		position: absolute;
		right: 22px;
		top: 22px;
		font-family: "Geist Mono", ui-monospace, monospace;
		font-size: 12px;
		color: var(--faint);
	}
	.af-ic {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--g1);
		color: #8ad68f;
		display: grid;
		place-items: center;
	}
	.af-ic :global(svg) {
		width: 19px;
		height: 19px;
	}
	/* Two classes, to beat the landing heading reset */
	.af-c h3 {
		font-size: 20px;
		font-weight: 500;
		letter-spacing: -0.02em;
		margin: 18px 0 0;
	}
	.af-c p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.55;
		margin: 8px 0 0;
	}
	.af-tk {
		display: grid;
		gap: 6px;
		margin-top: 18px;
	}
	.af-tk span {
		font-family: "Geist Mono", ui-monospace, monospace;
		font-size: 11.5px;
		background: var(--bg);
		border-radius: 8px;
		padding: 7px 10px;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.af-tk span.w {
		background: #fff4e8;
		color: #8a5410;
	}
	.af-c.in .af-tk span {
		opacity: 1;
		transform: none;
		transition-delay: calc(0.35s + var(--i) * 0.35s);
	}
	.af-c.in .af-tk span + span {
		transition-delay: calc(0.6s + var(--i) * 0.35s);
	}
	@media (max-width: 1080px) {
		.af {
			grid-template-columns: 1fr;
		}
	}
</style>
