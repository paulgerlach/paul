<!--
  "Oder Heidi kündigt für Sie." (.pg-sec.alt, .kd-hu): the dark card with the
  CTA and three steps. "Vertragsenden prüfen" shows once the Portfolio-Checker
  has a page (plan README, open question 2).
-->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { takeover } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="mk-hu-h">
	<div class="wrap">
		<div class="hu rv">
			<div>
				<span class="pill"
					><StrokeIcon
						><path
							d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
						/></StrokeIcon
					>{takeover.pill}</span
				>
				<h2 id="mk-hu-h">{takeover.h2}</h2>
				<p>{takeover.text}</p>
				<div class="btns">
					<ArrowLink href={takeover.demo.href} label={takeover.demo.text} />
					{#if takeover.check.href}
						<a class="ghost" href={takeover.check.href}>{takeover.check.text}</a
						>
					{/if}
				</div>
			</div>
			<ol>
				{#each takeover.steps as step, i (step.title)}
					<li>
						<span>{i + 1}</span><b>{step.title}</b><small>{step.text}</small>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.hu {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 48px;
		align-items: center;
		background: var(--ink);
		color: #fff;
		border-radius: 24px;
		padding: 48px;
	}
	/* .pg-pill-d */
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
		transform-origin: 50% 50%;
		transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		transform: scale(1.12);
	}
	/* `.hu h2`: beats the landing reset of heading margins. */
	.hu h2 {
		font-size: clamp(28px, 3.2vw, 42px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 16px;
	}
	.hu p {
		color: rgba(255, 255, 255, 0.72);
		margin-top: 12px;
		line-height: 1.55;
		max-width: 52ch;
	}
	.btns {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 26px;
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: transparent;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: #fff;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	li {
		display: grid;
		grid-template-columns: 36px 1fr;
		gap: 2px 14px;
		align-items: center;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 16px;
	}
	li span {
		grid-row: span 2;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		display: grid;
		place-items: center;
		font-weight: 600;
	}
	li b {
		font-size: 16px;
		font-weight: 600;
	}
	li small {
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.62);
	}
	@media (max-width: 1040px) {
		.hu {
			grid-template-columns: minmax(0, 1fr);
			padding: 36px;
		}
	}
	@media (max-width: 640px) {
		.hu {
			padding: 26px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
