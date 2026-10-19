<!--
  One feature row (.fr-row): the text with its link on one side, the tile on
  a tinted panel (.fr-vis) on the other; `rev` puts the text on the right.
  The row carries `.in` (the tile's end state) from the server.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { FeatureText } from "./types";

	let {
		id,
		row,
		rev = false,
		tone,
		children,
	}: {
		id: string;
		row: FeatureText;
		rev?: boolean;
		/** `g`: the green panel of the first row. */
		tone?: "g";
		children: Snippet;
	} = $props();
</script>

<div class={["row in rv", rev && "rev"]} {id}>
	<div class="tx">
		<h3>{row.title}</h3>
		<p>
			{#if typeof row.text === "string"}
				{row.text}
			{:else}
				{#each row.text as part, i (i)}
					{#if typeof part === "string"}{part}{:else}<a href={part.href}
							>{part.text}</a
						>{/if}
				{/each}
			{/if}
		</p>
		{#if row.link}
			<a class="more" href={row.link.href}
				>{row.link.text} <span class="ar" aria-hidden="true">→</span></a
			>
		{/if}
	</div>
	<div class={["vis", tone]}>{@render children()}</div>
</div>

<style>
	.row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 64px;
		align-items: center;
		padding: 40px 0;
		border-top: 1px solid #c9d0cd;
	}
	.row:last-child {
		border-bottom: 1px solid #c9d0cd;
	}
	.rev .tx {
		order: 2;
		padding-left: 40px;
	}
	/* `.tx h3`: beats the landing reset of heading margins. */
	.tx h3 {
		font-size: clamp(28px, 3vw, 40px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}
	p {
		font-size: 16.5px;
		color: var(--muted);
		line-height: 1.55;
		margin-top: 14px;
		max-width: 44ch;
	}
	p a {
		color: var(--ink);
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.more {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 22px;
		font-size: 15.5px;
		font-weight: 500;
		color: var(--ink);
	}
	.more .ar {
		transition: transform 0.2s;
	}
	.more:hover .ar {
		transform: translateX(3px);
	}
	.vis {
		position: relative;
		height: 420px;
		border-radius: 14px;
		background: var(--bg);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.vis.g {
		background: #e4efe6;
		container-type: inline-size;
	}
	/* Kept at low specificity (`:where`), so a tile's own rules win.
	   The tiles' white card (.fr-card) and their icon squares (.fr-ic). */
	:where(.vis) :global(.card) {
		background: #fdfdfc;
		border-radius: 14px;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.05);
	}
	:where(.vis) :global(.ic) {
		width: 72px;
		height: 72px;
		border-radius: 12px;
		background: #e4efe6;
		display: grid;
		place-items: center;
		flex: none;
	}
	:where(.vis) :global(.ic svg) {
		width: 30px;
		height: 30px;
	}
	:where(.vis) :global(.ic.dk) {
		background: var(--ink);
		color: var(--accent);
	}
	/* The designs' "Beispieldaten" tag (.dbm-demo). */
	:where(.vis) :global(.demo) {
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	@media (max-width: 900px) {
		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
		}
		.rev .tx {
			order: 0;
			padding-left: 0;
		}
		.vis {
			height: 340px;
		}
	}
	@media (max-width: 480px) {
		:where(.vis) :global(.ic) {
			width: 56px;
			height: 56px;
		}
	}
</style>
