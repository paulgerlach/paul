<!--
  The four feature rows (.uv-rows, the "Mehr erfahren" target): text with a
  eyebrow pill (the design's #eb-css restyles its .uv-tag), a two-line H2, two paragraphs and the CTAs on the left, an
  animated tile on the right. The tiles illustrate the text and are hidden
  from screen readers.
-->
<script lang="ts">
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import { rows, type TileKind } from "../content";
	import Before from "./tiles/Before.svelte";
	import Calendar from "./tiles/Calendar.svelte";
	import Phone from "./tiles/Phone.svelte";
	import StatementTile from "./tiles/Statement.svelte";

	const tiles = {
		calendar: Calendar,
		phone: Phone,
		statement: StatementTile,
		before: Before,
	} satisfies Record<TileKind, unknown>;
</script>

<section class="rows" id="inhalt" aria-label={rows.label}>
	<div class="wrap">
		{#each rows.items as row, i (row.tag)}
			{@const Tile = tiles[row.tile]}
			<article class="row rv" aria-labelledby="mp-row-{i}">
				<div class="txt">
					<Eyebrow text={row.tag} />
					<h2 id="mp-row-{i}">{row.title[0]}<br />{row.title[1]}</h2>
					{#each row.paragraphs as paragraph (paragraph)}
						<p>{paragraph}</p>
					{/each}
					<div class="ctas">
						<a
							class="uv-btn w"
							href={rows.primary.href}
							onclick={rows.primary.href === START_HREF
								? focusSignup
								: undefined}>{rows.primary.text}</a
						>
						<a class="uv-btn d" href={rows.secondary.href}
							>{rows.secondary.text}</a
						>
					</div>
				</div>
				<div class={["tile", row.tone]} aria-hidden="true">
					<Tile />
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
