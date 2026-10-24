<!-- The one-off costs and large portfolios (.pg-sec.alt): three cards. The design labels the section by the third card's heading. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { extras } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="pr-eh">
	<div class="wrap">
		<div class="three">
			{#each extras as card, i (card.title)}
				<article class="mini rv">
					<span class="mi"><Icon name={card.icon} /></span>
					<h3 id={i === extras.length - 1 ? "pr-eh" : undefined}>
						{card.title}
					</h3>
					<p>{card.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.three {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	.mini {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 24px;
	}
	.mi {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--bg);
		display: grid;
		place-items: center;
	}
	.mi :global(svg) {
		width: 20px;
		height: 20px;
	}
	/* `.mini h3`: beats the landing reset of heading margins. */
	.mini h3 {
		font-size: 18px;
		font-weight: 600;
		margin: 16px 0 6px;
	}
	.mini p {
		margin: 0;
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.55;
	}
	@media (max-width: 1040px) {
		.three {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
