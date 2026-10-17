<!-- Dark hero: pill, H1, lead and CTAs; the "Ein Tag bei Heidi" feed on the right. No `#start`: the page has no signup form. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import ApplyLink from "../components/ApplyLink.svelte";
	import { hero, jobs } from "../content";
	import DayFeed from "./DayFeed.svelte";
</script>

<section class="hero" aria-labelledby="kr-h1">
	<div class="wrap grid">
		<div>
			<span class="pill rv"><Icon name="users" />{hero.pill}</span>
			<h1 class="rv" id="kr-h1">{hero.h1.text} <em>{hero.h1.em}</em></h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<!-- ArrowLink's light look, with the design's ↓ arrow -->
				<a class="bk" href={hero.jobs.href}>
					{hero.jobs.text} <span class="ar" aria-hidden="true">↓</span>
				</a>
				<ApplyLink role={jobs.initiative.id} class="ghost">
					{hero.initiative} <span class="ar" aria-hidden="true">→</span>
				</ApplyLink>
			</div>
		</div>
		<DayFeed />
	</div>
</section>

<style>
	.hero {
		background: var(--ink);
		color: #fff;
		padding: 72px 0 88px;
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
		gap: 9px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		padding: 7px 14px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.86);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
	}
	h1 {
		font-size: clamp(38px, 4.6vw, 62px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	h1 em {
		font-style: normal;
		color: var(--accent);
	}
	.lead {
		color: rgba(255, 255, 255, 0.72);
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
	.bk,
	.ctas :global(.ghost) {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border-radius: 11px;
		font-size: 15.5px;
		font-weight: 600;
	}
	.bk {
		justify-content: center;
		background: var(--accent);
		color: var(--ink);
		padding: 14px 20px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #fff;
	}
	.bk:active {
		transform: scale(0.98);
	}
	.ctas :global(.ghost) {
		border: 1px solid rgba(255, 255, 255, 0.24);
		background: transparent;
		color: #fff;
		padding: 13px 18px;
		transition: border-color 0.2s;
	}
	.ctas :global(.ghost:hover) {
		border-color: rgba(255, 255, 255, 0.5);
	}
	.ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateY(3px);
	}
	.ctas :global(.ghost .ar) {
		transition: transform 0.25s;
	}
	.ctas :global(.ghost:hover .ar) {
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
		.bk,
		.ctas :global(.ghost) {
			justify-content: center;
		}
	}
</style>
