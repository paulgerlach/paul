<!--
  "Für den ganzen Bestand" (.pg-sec.alt, .fr-pf): the shared head, the text
  and the example list (.fr-list, hidden from screen readers like the design,
  with its rows as a visually hidden list). A CTA shows once its page
  exists (plan README, open question 1), in its design's look (the first
  dark, the second light) even when the first is hidden.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { portfolio } from "../content";

	const ctas = portfolio.ctas.flatMap((cta, i) =>
		cta.href
			? [{ text: cta.text, href: cta.href, look: i ? "ghost" : "bk" }]
			: [],
	);
</script>

{#snippet building()}
	<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
{/snippet}

<section class="pg-sec alt" aria-labelledby="fr-pf-h">
	<div class="wrap cols">
		<div>
			<SectionHead
				id="fr-pf-h"
				eyebrow={portfolio.pill}
				icon={building}
				heading={portfolio.h2}
			/>
			<p class="rv">{portfolio.text}</p>
			{#if ctas.length}
				<div class="ctas rv">
					{#each ctas as cta (cta.text)}
						<a class={cta.look} href={cta.href}
							>{cta.text} <span class="ar" aria-hidden="true">→</span></a
						>
					{/each}
				</div>
			{/if}
		</div>
		<div class="list rv">
			<div aria-hidden="true">
				{#each portfolio.rows as row (row.name)}
					<div class="li">
						<b>{row.name}</b><span>{row.text}</span><em class={row.tone}
							>{row.action}</em
						>
					</div>
				{/each}
			</div>
			<ul class="sr-only">
				{#each portfolio.rows as row (row.name)}
					<li>{row.name}: {row.text}, {row.action}</li>
				{/each}
			</ul>
			<span class="demo">{portfolio.demo}</span>
		</div>
	</div>
</section>

<style>
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 56px;
		align-items: center;
	}
	p {
		color: var(--muted);
		font-size: 17px;
		line-height: 1.55;
		margin-top: 16px;
		max-width: 46ch;
	}
	.ctas {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 32px;
	}
	.bk,
	.ghost {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border-radius: 11px;
		font-size: 15.5px;
		font-weight: 600;
	}
	.bk {
		background: var(--ink);
		color: #fff;
		padding: 14px 20px;
	}
	.bk:hover {
		background: #2a443d;
	}
	.ghost {
		border: 1px solid var(--hair);
		background: #fff;
		padding: 13px 18px;
		color: var(--ink);
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	.list {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 10px;
		position: relative;
	}
	.li {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 2px 12px;
		align-items: center;
		padding: 12px;
		border-radius: 10px;
	}
	.li + .li {
		border-top: 1px solid #f0f1f0;
	}
	.li b {
		font-size: 14.5px;
		font-weight: 600;
	}
	.li span {
		grid-column: 1;
		font-size: 12.5px;
		color: var(--muted);
	}
	.li em {
		grid-row: 1 / 3;
		grid-column: 2;
		font-style: normal;
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
		padding: 5px 11px;
	}
	.li em.t {
		background: var(--ink);
		color: #fff;
	}
	.li em.k {
		background: #fbefd9;
		color: #8a5a10;
	}
	.li em.a {
		background: #e3f3e4;
		color: #2f7a3c;
	}
	/* .dbm-demo */
	.demo {
		position: absolute;
		right: 14px;
		bottom: -12px;
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	@media (max-width: 900px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 36px;
		}
	}
	@media (max-width: 640px) {
		.ctas {
			flex-direction: column;
		}
	}
</style>
