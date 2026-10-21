<!-- Light, centred hero: pill, H1, lead, the search and the popular questions. No `#start`: the header CTA goes to /demo-buchen. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { hero } from "../content";
	import Popular from "./Popular.svelte";
	import SearchBox from "./SearchBox.svelte";
</script>

<section class="hero" aria-labelledby="hc-h1">
	<div class="wrap">
		<span class="pill rv"><Icon name="info" />{hero.pill}</span>
		<h1 class="rv" id="hc-h1">{hero.h1.text} <em>{hero.h1.em}</em></h1>
		<p class="lead rv">{hero.lead}</p>
		<SearchBox />
		<Popular />
	</div>
</section>

<style>
	.hero {
		padding: 72px 0 40px;
		text-align: center;
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
		font-size: clamp(38px, 4.8vw, 64px);
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
		margin: 18px auto 0;
		max-width: 52ch;
		line-height: 1.55;
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
			padding: 44px 0 40px;
		}
	}
</style>
