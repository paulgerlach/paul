<!-- "Übernehmen oder kündigen? Beides geht mit Heidi." (.pg-sec.alt, .pc-dec): the two follow-ups, the second dark. The ticks are ink as the design draws them; on the dark card, where the design's ink tick vanishes, they take its CSS colour (the accent). -->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { decision } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="dec-h">
	<div class="wrap">
		<Head
			id="dec-h"
			pill={decision.pill}
			symbol="swap"
			heading={decision.heading}
		/>
		<div class="dec">
			{#each decision.cards as card (card.title)}
				<article class={["rv", card.dark && "dark"]}>
					<span class="di"><Icon name={card.icon} /></span>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
					<ul>
						{#each card.points as point (point)}
							<li>
								<Check color={card.dark ? "currentColor" : undefined} />{point}
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.dec {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
		margin-top: 40px;
	}
	article {
		background: #f2f4f3;
		border-radius: 22px;
		padding: 28px;
	}
	article.dark {
		background: var(--ink);
		color: #fff;
	}
	.di {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: #fff;
		color: var(--ink);
		display: grid;
		place-items: center;
	}
	.di :global(svg) {
		width: 20px;
		height: 20px;
	}
	.dark .di {
		background: rgba(255, 255, 255, 0.1);
		color: var(--accent);
	}
	/* `.dec h3`: beats the landing reset of heading margins. */
	.dec h3 {
		font-size: 21px;
		font-weight: 600;
		margin-top: 16px;
	}
	p {
		font-size: 15.5px;
		line-height: 1.55;
		margin-top: 8px;
		color: var(--muted);
	}
	.dark p {
		color: rgba(255, 255, 255, 0.7);
	}
	ul {
		list-style: none;
		margin: 16px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
		font-size: 14.5px;
	}
	li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	li :global(svg) {
		width: 12px;
	}
	.dark li :global(svg) {
		color: var(--accent);
	}
	@media (max-width: 980px) {
		.dec {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
