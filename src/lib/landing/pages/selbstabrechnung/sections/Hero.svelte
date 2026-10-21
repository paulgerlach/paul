<!-- Hero: pill, H1, lead, the two CTAs, three ticks and the billing demo card. No `#start`: the page has no form. -->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Icon from "../components/Icon.svelte";
	import { hero } from "../content";
	import BillingDemo from "./BillingDemo.svelte";
</script>

<section class="hero" aria-labelledby="sa-h1">
	<div class="wrap grid">
		<div>
			<span class="pill rv"><Icon name="calc" />{hero.pill}</span>
			<h1 class="rv" id="sa-h1">
				{hero.h1.text}<br /><em>{hero.h1.em}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<ArrowLink href={hero.cta.href} label={hero.cta.text} ink />
				<a class="ghost" href={hero.calcLink.href}
					>{hero.calcLink.text} <span class="ar" aria-hidden="true">↓</span></a
				>
			</div>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="okb"><Check /></span>{tick}</li>
				{/each}
			</ul>
		</div>
		<BillingDemo />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
		/* The confetti canvas reaches past the card; never widen the page. */
		overflow-x: clip;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: center;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
	}
	h1 {
		font-size: clamp(38px, 4.4vw, 58px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	h1 em {
		font-style: normal;
		color: var(--ok);
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 18px;
		max-width: 52ch;
		line-height: 1.55;
	}
	.ctas {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 32px;
	}
	.ctas :global(.bk) {
		padding: 14px 20px;
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
	.ticks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		margin-top: 28px;
		font-size: 14.5px;
		color: var(--muted);
		list-style: none;
		padding: 0;
	}
	.ticks li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.okb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e3f3e4;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.okb :global(svg) {
		width: 10px;
	}

	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
	}
	/* The design's #hs-css heading sizes */
	@media (max-width: 1040px) and (min-width: 621px) {
		h1 {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
	}
	@media (max-width: 620px) {
		h1 {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
		.ctas {
			flex-direction: column;
		}
		.ctas :global(.bk),
		.ghost {
			justify-content: center;
		}
	}
</style>
