<!-- Two columns: pill, H1, lead, CTAs and ticks; the service checklist on the right. -->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { careers, hero } from "../content";
	import StrokeIcon from "../components/StrokeIcon.svelte";
	import ServiceStack from "./ServiceStack.svelte";
</script>

<section class="hero" aria-labelledby="ub-h1">
	<div class="wrap grid">
		<div>
			<span class="pill rv">
				<StrokeIcon
					><path
						d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2"
					/></StrokeIcon
				>{hero.pill}
			</span>
			<h1 class="rv" id="ub-h1">{hero.h1.text} <em>{hero.h1.em}</em></h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<ArrowLink href={hero.cta.href} label={hero.cta.text} ink />
				{#if careers.show}
					<a
						class="ghost"
						href={hero.careers.href}
						target="_blank"
						rel="noopener"
					>
						{hero.careers.text} <span class="ar" aria-hidden="true">→</span>
					</a>
				{/if}
			</div>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="okb"><Check /></span>{tick}</li>
				{/each}
			</ul>
		</div>
		<ServiceStack />
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
	.ghost .ar {
		transition: transform 0.25s;
	}
	.ghost:hover .ar {
		transform: translateX(4px);
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
