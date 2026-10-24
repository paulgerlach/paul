<!--
  "Wann Mieter kürzen dürfen." (.pg-sec.alt#kuerzung, .lf-kz): the shared
  head and three cards. The design's line "Prüfen Sie, ob Ihre Mieter kürzen
  könnten: Heizkostenabrechnung prüfen →" shows once its page exists.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { penalties, PENALTIES_ID } from "../content";
</script>

{#snippet warnIcon()}
	<path d="M10 3l7.5 13h-15z" /><path d="M10 8v4M10 14.3v.1" />
{/snippet}

<section class="pg-sec alt" id={PENALTIES_ID} aria-labelledby="lf-kz-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="lf-kz-h"
				eyebrow={penalties.pill}
				icon={warnIcon}
				heading={penalties.h2}
				center
			/>
		</div>
		<div class="cards">
			{#each penalties.cards as card (card.title)}
				<article class="rv">
					<b>{card.value}</b>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
				</article>
			{/each}
		</div>
		{#if penalties.cta.link.href}
			<p class="cta rv">
				{penalties.cta.text}
				<a href={penalties.cta.link.href}>{penalties.cta.link.text} →</a>
			</p>
		{/if}
	</div>
</section>

<style>
	section {
		scroll-margin-top: 72px;
	}
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin-top: 48px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 24px;
	}
	b {
		display: block;
		font-size: 44px;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: #a8431a;
	}
	/* `.cards h3`: beats the landing reset of heading margins. */
	.cards h3 {
		font-size: 17px;
		font-weight: 600;
		margin-top: 8px;
	}
	article p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.5;
		margin-top: 6px;
	}
	.cta {
		text-align: center;
		margin-top: 28px;
		color: var(--muted);
	}
	.cta a {
		color: var(--ok);
		font-weight: 600;
	}
	@media (max-width: 900px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
