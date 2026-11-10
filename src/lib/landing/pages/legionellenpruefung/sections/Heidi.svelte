<!--
  "Alles rund um Ihre Liegenschaft. Aus einer Hand." (.pg-sec.alt, the
  design's dark .ea-heidi.lg-heidi card): "Im Self-Service anfragen →", the
  price and the list of Heidi's services, this page's entry marked. An
  entry whose page doesn't exist yet is plain text. The entries rise in one
  by one as the card reveals (server-rendered shown).
-->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { heidi } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="hd-h">
	<div class="wrap">
		<div class="card rv">
			<div>
				<span class="pill"
					><StrokeIcon><path d="M3 17h14M6 14V9M10 14V5M14 14v-3" /></StrokeIcon
					>{heidi.pill}</span
				>
				<h2 id="hd-h">{heidi.h2}</h2>
				<p>{heidi.text}</p>
				<div class="cta">
					<ArrowLink href={heidi.cta.href} label={heidi.cta.text} />
					<span class="price"
						>{heidi.price.from} <b>{heidi.price.value}</b>
						{heidi.price.unit}</span
					>
				</div>
			</div>
			<ul class="bundle" aria-label={heidi.label}>
				{#each heidi.bundle as item, i (item.text)}
					<li class={[item.current && "hi"]} style:--i={i}>
						{#if item.href}
							<a href={item.href}
								><span class="c"><Check /></span>{item.text}<svg
									class="ba"
									width="16"
									height="16"
									viewBox="0 0 20 20"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"><path d="M3 10h14M13 6l4 4-4 4" /></svg
								></a
							>
						{:else if item.current}
							<span class="cur" aria-current="page"
								><span class="c"><Check /></span>{item.text}<small
									>{heidi.current}</small
								></span
							>
						{:else}
							<span class="cur"
								><span class="c"><Check /></span>{item.text}</span
							>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.card {
		background: var(--ink);
		color: #fff;
		border-radius: 24px;
		padding: 48px clamp(24px, 5vw, 56px);
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
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
		transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.pill:hover :global(svg) {
		transform: scale(1.12);
	}
	/* `.card h2`: beats the landing reset of heading margins. */
	.card h2 {
		font-size: clamp(28px, 3.2vw, 42px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 18px;
		line-height: 1.1;
		color: #fff;
	}
	.card p {
		color: rgba(255, 255, 255, 0.72);
		font-size: 17px;
		line-height: 1.5;
		margin-top: 14px;
		max-width: 48ch;
	}
	.cta {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		margin-top: 24px;
	}
	.price {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.7);
	}
	.price b {
		color: #fff;
		font-weight: 600;
		font-size: 16px;
	}
	.bundle {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	.bundle li {
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 14px;
		font-size: 16px;
		color: rgba(255, 255, 255, 0.85);
		transition:
			opacity 0.5s calc(var(--i) * 0.18s),
			translate 0.5s calc(var(--i) * 0.18s),
			border-color 0.2s,
			background 0.2s;
	}
	.bundle a,
	.bundle .cur {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		color: inherit;
	}
	.bundle a:hover {
		color: #fff;
	}
	.bundle li:has(a:hover) {
		border-color: rgba(255, 255, 255, 0.3);
	}
	.ba {
		margin-left: auto;
		opacity: 0.6;
		transition:
			transform 0.25s,
			opacity 0.2s;
	}
	.bundle a:hover .ba {
		transform: translateX(3px);
		opacity: 1;
	}
	.cur small {
		margin-left: auto;
		font-size: 12px;
		color: var(--accent);
	}
	.c {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		flex: none;
		transition: background 0.4s calc(var(--i) * 0.18s + 0.3s);
	}
	.c :global(svg) {
		width: 10px;
	}
	.c :global(path) {
		transition: stroke 0.4s calc(var(--i) * 0.18s + 0.3s);
	}
	.bundle li.hi {
		background: rgba(138, 214, 143, 0.12);
		border-color: rgba(138, 214, 143, 0.45);
		color: #fff;
		font-weight: 500;
	}
	/* Before the reveal: hidden, the ticks unlit. */
	.card:global(.rv-wait) .bundle li {
		opacity: 0;
		translate: 0 10px;
	}
	.card:global(.rv-wait) .c {
		background: rgba(255, 255, 255, 0.1);
	}
	.card:global(.rv-wait) .c :global(path) {
		stroke: #fff;
	}
	@media (max-width: 1040px) {
		.card {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.card {
			padding: 36px 22px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
