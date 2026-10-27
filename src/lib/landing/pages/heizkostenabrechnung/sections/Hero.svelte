<!-- Hero (.pg-hero with .hk-hero): pill, H1, lead and the two CTAs, centred. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { hero } from "../content";
</script>

<section class="hero" aria-labelledby="hk-h1">
	<div class="wrap in">
		<span class="pill rv"><Icon name="doc" />{hero.pill}</span>
		<h1 data-hs lang="de" class="rv" id="hk-h1">
			{hero.h1} <em>{hero.h1Accent}</em>
		</h1>
		<p class="lead rv">{hero.lead}</p>
		<div class="ctas rv">
			<a class="bk" href={hero.demo.href}
				>{hero.demo.text} <span class="ar" aria-hidden="true">→</span></a
			>
			<a class="ghost" href={hero.scan.href}
				>{hero.scan.text} <span aria-hidden="true">↓</span></a
			>
		</div>
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	.in {
		max-width: 900px;
		text-align: center;
	}
	/* `.in h1`: beats the landing reset of heading margins. */
	.in h1 {
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
	.ctas {
		display: flex;
		justify-content: center;
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
		font-size: 14.5px;
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
