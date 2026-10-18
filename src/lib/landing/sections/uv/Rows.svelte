<!--
  The feature rows of a `uv` page (.uv-rows, the "Mehr erfahren" target):
  text with an eyebrow pill (the design's #eb-css restyles its .uv-tag), a
  two-line H2, two paragraphs and the CTAs on the left, an animated tile on
  the right. The tiles illustrate the text and are hidden from screen readers.
-->
<script lang="ts" generics="Kind extends string">
	import type { Snippet } from "svelte";
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import type { Link, Paragraph, Row } from "./types";

	let {
		idPrefix,
		label,
		items,
		primary,
		secondary,
		tile,
	}: {
		/** Prefix of the rows' heading ids. */
		idPrefix: string;
		label: string;
		items: Row<Kind>[];
		primary: Link;
		/** The second button of every row without its own. */
		secondary: Link;
		tile: Snippet<[Kind]>;
	} = $props();
</script>

{#snippet paragraph(p: Paragraph)}
	<p>
		{#if typeof p === "string"}{p}{:else}{#each p as part, i (i)}{#if typeof part === "string"}{part}{:else}<a
						href={part.href}>{part.text}</a
					>{/if}{/each}{/if}
	</p>
{/snippet}

<section class="rows" id="inhalt" aria-label={label}>
	<div class="wrap">
		{#each items as row, i (row.tag)}
			{@const second = row.secondary ?? secondary}
			<article class="row rv" aria-labelledby="{idPrefix}-{i}">
				<div class="txt">
					<Eyebrow text={row.tag} />
					<h2 id="{idPrefix}-{i}">{row.title[0]}<br />{row.title[1]}</h2>
					{#each row.paragraphs as p, j (j)}
						{@render paragraph(p)}
					{/each}
					<div class="ctas">
						<a
							class="uv-btn w"
							href={primary.href}
							onclick={primary.href === START_HREF ? focusSignup : undefined}
							>{primary.text}</a
						>
						<a class="uv-btn d" href={second.href}>{second.text}</a>
					</div>
				</div>
				<div class={["tile", row.tone]} aria-hidden="true">
					{@render tile(row.tile)}
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.rows {
		padding-bottom: 40px;
		scroll-margin-top: 72px;
	}
	.row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
		gap: clamp(28px, 6vw, 110px);
		align-items: center;
		padding: clamp(56px, 8vw, 110px) 0;
	}
	/* Beats the landing heading reset (tokens.css). */
	.txt h2 {
		font-size: clamp(32px, 4vw, 56px);
		line-height: 1.02;
		letter-spacing: -0.04em;
		font-weight: 400;
		margin-top: 22px;
	}
	.txt p {
		color: var(--mute);
		font-size: clamp(16px, 1.35vw, 19px);
		line-height: 1.5;
		margin: 20px 0 0;
		max-width: 46ch;
	}
	.txt h2 + p {
		margin-top: 32px;
	}
	.txt p a {
		color: var(--lime);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.ctas {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 28px;
	}
	.tile {
		position: relative;
		border-radius: 26px;
		aspect-ratio: 1/1.02;
		max-height: 640px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		color: var(--ink);
		padding: clamp(20px, 4vw, 52px);
	}
	.mint {
		background: #e4efe6;
	}
	.stone {
		background: #efeeea;
	}
	.ink {
		background: var(--card);
	}
	@media (max-width: 980px) {
		.row {
			grid-template-columns: 1fr;
		}
		.tile {
			aspect-ratio: auto;
			min-height: 440px;
		}
	}
</style>
