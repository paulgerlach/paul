<!-- "Vier Punkte, die jede Abrechnung erfüllen muss.": four cards with their legal source. The Checker row only renders once its page exists (`CHECKER_HREF`). -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { CHECKER_HREF, duties } from "../content";
</script>

<section class="sec alt" aria-labelledby="duty-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="duty-h" eyebrow={duties.pill} heading={duties.h2}>
				{#snippet icon()}
					<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
						d="M12 2.5V6h3.5M8 10h5M8 13h5"
					/>
				{/snippet}
			</SectionHead>
		</div>
		<div class="duty">
			{#each duties.cards as card (card.title)}
				<article class="rv">
					<span class="dn">{card.figure}</span>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
					<small>{card.source}</small>
				</article>
			{/each}
		</div>
		{#if CHECKER_HREF}
			<div class="cta-row rv">
				<span>{duties.ctaText}</span>
				<a class="ghost" href={CHECKER_HREF}
					>{duties.ctaLink} <span aria-hidden="true">→</span></a
				>
			</div>
		{/if}
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.alt {
		background: var(--bg);
	}
	.head {
		max-width: 760px;
	}
	.duty {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 24px 22px;
		display: flex;
		flex-direction: column;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	@media (hover: hover) {
		article:hover {
			transform: translateY(-3px);
			box-shadow: 0 18px 40px -26px rgba(30, 50, 45, 0.35);
		}
	}
	.dn {
		font-size: 30px;
		font-weight: 500;
		letter-spacing: -0.035em;
		line-height: 1;
	}
	h3 {
		font-size: 17px;
		font-weight: 600;
		margin-top: 18px;
	}
	p {
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 8px;
		flex: 1;
	}
	small {
		font-size: 12.5px;
		color: var(--faint);
		font-weight: 500;
		margin-top: 16px;
	}
	.cta-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		margin-top: 20px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 16px 18px 16px 22px;
		font-size: 15.5px;
		font-weight: 500;
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}

	@media (max-width: 1040px) {
		.duty {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
		.duty {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		article {
			transition: none;
		}
	}
</style>
