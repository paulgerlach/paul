<!--
  The hero (.pg-hero): pill, H1, lead and two CTAs on the left, the modules
  card (.fm) on the right. Server-rendered with every module done; with
  motion, after holding that for 4.5 s while in view, the modules go out and
  light up one after the other, then hold again (the design's `#fk-js`).
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import ModulesCard from "./ModulesCard.svelte";
	import { hero } from "../content";
</script>

<section class="hero" aria-labelledby="fk-h1">
	<div class="wrap grid">
		<div>
			<span class="pill rv"><Icon name={hero.eyebrowIcon} />{hero.eyebrow}</span
			>
			<h1 data-hs class="rv" id="fk-h1">
				{hero.h1.text}<em>{hero.h1.accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a class="btn-dark" href={hero.primary.href}
					>{hero.primary.text} <span class="ar" aria-hidden="true">→</span></a
				>
				<a class="btn-ghost" href={hero.secondary.href}
					>{hero.secondary.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</div>
		</div>

		<ModulesCard />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
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
	/* `.grid h1`: beats the landing reset of heading margins. */
	.grid h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	.grid h1 em {
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
	.btn-dark,
	.btn-ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border-radius: 11px;
		font-size: 15.5px;
		font-weight: 600;
		transition:
			background 0.2s,
			border-color 0.2s,
			transform 0.15s;
	}
	.btn-dark {
		background: var(--ink);
		color: #fff;
		padding: 14px 20px;
	}
	.btn-dark:hover {
		background: #2a443d;
	}
	.btn-dark:active {
		transform: scale(0.98);
	}
	.btn-ghost {
		border: 1px solid var(--hair);
		background: #fff;
		color: var(--ink);
		padding: 13px 18px;
	}
	.btn-ghost:hover {
		border-color: #c3cdc8;
	}
	.ar {
		transition: transform 0.25s;
	}
	.btn-dark:hover .ar {
		transform: translateX(4px);
	}

	@media (max-width: 1040px) {
		.grid {
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
		.btn-dark,
		.btn-ghost {
			justify-content: center;
		}
	}
</style>
