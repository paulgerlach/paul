<!-- "Wechseln, ohne aufs Vertragsende zu warten." (.mv-sw): the dark band with "So funktioniert der Wechsel →" (/messdienst-wechseln) and three figures. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { switching } from "../content";
</script>

<section class="pg-sec" aria-labelledby="sw-h">
	<div class="wrap">
		<div class="sw rv">
			<div>
				<span class="pill"><Icon name="swap" />{switching.pill}</span>
				<h2 id="sw-h">{switching.h2}</h2>
				<p>{switching.text}</p>
				<a class="bk-next inv cta" href={switching.cta.href}
					>{switching.cta.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</div>
			<ul>
				{#each switching.figures as figure (figure.value)}
					<li><b>{figure.value}</b><span>{figure.text}</span></li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.sw {
		background: var(--ink);
		color: #fff;
		border-radius: 24px;
		padding: 48px clamp(24px, 5vw, 56px);
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: 40px;
		align-items: center;
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
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		transform: scale(1.12);
	}
	/* `.sw h2`: beats the landing reset of heading margins; the size stays
	   below #hs-css's (the page's). */
	.sw h2 {
		font-size: clamp(28px, 3.2vw, 42px);
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		line-height: 1.1;
		max-width: 18ch;
	}
	p {
		color: rgba(255, 255, 255, 0.72);
		font-size: 17px;
		line-height: 1.5;
		margin-top: 14px;
		max-width: 46ch;
	}
	/* .mv-sw .bk-next (`.sw .cta` outweighs the page's shared .bk-next.inv) */
	.sw .cta {
		margin-top: 26px;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	li {
		display: flex;
		align-items: baseline;
		gap: 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 16px;
		padding: 16px 18px;
	}
	b {
		font-size: 28px;
		font-weight: 500;
		letter-spacing: -0.03em;
		color: var(--accent);
		min-width: 4.3em;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	li span {
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.75);
	}
	@media (max-width: 1040px) {
		.sw {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.sw {
			padding: 36px 22px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
