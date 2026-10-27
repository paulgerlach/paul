<!--
  Hero (.pg-hero with #rf-css, `#start`): pill, H1, lead, "Demo buchen" and
  "Alle Stimmen lesen" (→ `#stimmen`), and the dark quote carousel beside it.
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { hero } from "../content";
	import Carousel from "./Carousel.svelte";
</script>

<section class="hero" id="start" aria-labelledby="rf-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="star" />{hero.pill}</span>
			<h1 data-hs class="rv" id="rf-h1">
				{hero.h1} <em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a class="bk" href={hero.demo.href}
					>{hero.demo.text} <span class="ar" aria-hidden="true">→</span></a
				>
				<a class="ghost" href={hero.voices.href}
					>{hero.voices.text} <span class="ar" aria-hidden="true">↓</span></a
				>
			</div>
		</div>

		<Carousel />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: center;
	}
	/* `.cols h1`: beats the landing reset of heading margins. */
	.cols h1 {
		font-size: clamp(38px, 4.6vw, 62px);
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
	/* .bk-next (dark) */
	.bk {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 20px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #2a443d;
	}
	.bk:active {
		transform: scale(0.98);
	}
	.bk .ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateX(4px);
	}
	/* .pg-ghost */
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
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
		.ctas {
			flex-direction: column;
		}
		.bk,
		.ghost {
			justify-content: center;
		}
	}
</style>
