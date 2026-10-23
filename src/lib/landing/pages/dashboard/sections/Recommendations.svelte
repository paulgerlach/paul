<!--
  "Für jede Liegenschaft der nächste Schritt" (`.db-rep`): the shared
  per-property list (`NextSteps`, also on /portfolio-check) and the three
  small cards.
-->
<script lang="ts">
	import NextSteps from "$lib/landing/sections/NextSteps.svelte";
	import Pill from "../components/Pill.svelte";
	import { recommendations as rec } from "../content";
</script>

<section class="sec rep" aria-labelledby="rep-h">
	<div class="wrap db-c">
		<Pill text={rec.pill} icon="sparkle" class="rv" />
		<h2 class="db-h2 rv" id="rep-h">{rec.h2}</h2>
		<p class="db-lead rv">{rec.lead}</p>
	</div>
	<div class="wrap">
		<NextSteps />
		<ul class="cards rv">
			{#each rec.cards as card (card.title)}
				<li>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.rep {
		padding: 112px 0 12px;
	}
	.cards {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		margin: 12px 0 0;
		padding: 32px 8px;
		box-shadow: 0 20px 40px -30px rgba(30, 50, 45, 0.3);
	}
	.cards li {
		padding: 0 28px;
		border-left: 1px solid var(--hair);
	}
	.cards li:first-child {
		border-left: 0;
	}
	.cards h3 {
		font-size: 19px;
		font-weight: 600;
	}
	.cards p {
		color: var(--muted);
		margin: 10px 0 0;
		font-size: 16px;
	}
	@media (max-width: 900px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
			padding: 28px 0;
		}
		.cards li {
			border-left: 0;
		}
	}
</style>
