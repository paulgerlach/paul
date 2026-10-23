<!-- "Sechs Fragen, bevor Sie unterschreiben." (.mv-tips): six numbered cards, two with a link ("Zur Umrüstpflicht" → /fernablesung-umruesten, "Zum Kostenrechner" → #kosten). -->
<script lang="ts">
	import Head from "../components/Head.svelte";
	import { tips } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="tips-h">
	<div class="wrap">
		<Head id="tips-h" pill={tips.pill} symbol="search" heading={tips.h2} />
		<div class="tips">
			{#each tips.items as tip, i (tip.title)}
				<article class="rv">
					<span class="tn">{String(i + 1).padStart(2, "0")}</span>
					<h3>{tip.title}</h3>
					<p>{tip.text}</p>
					{#if tip.link}<a href={tip.link.href}>{tip.link.text} →</a>{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.tips {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 24px;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	article:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px -26px rgba(30, 50, 45, 0.35);
	}
	.tn {
		font-size: 13px;
		font-weight: 600;
		color: var(--faint);
		font-variant-numeric: tabular-nums;
	}
	/* `article h3`: beats the landing reset of heading margins. */
	article h3 {
		font-size: 18px;
		font-weight: 600;
		margin-top: 14px;
		letter-spacing: -0.01em;
	}
	p {
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 8px;
	}
	a {
		display: inline-block;
		margin-top: 12px;
		font-size: 14px;
		font-weight: 600;
		color: var(--ok);
	}
	@media (max-width: 1040px) {
		.tips {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.tips {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		article:hover {
			transform: none;
		}
	}
</style>
