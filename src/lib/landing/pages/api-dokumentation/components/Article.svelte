<!-- One article of the documentation (.ad-sec): its anchor, the H2 with the optional version badge (.ad-sh), then the article's blocks. It's `.art`, not the design's `.sec` (`.lp .sec` adds padding). Its paragraphs get the design's `.ad-sec > p` rules, `.sm` the small ones. -->
<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		id,
		h2,
		version,
		children,
	}: { id: string; h2: string; version?: string; children: Snippet } = $props();
</script>

<article class="art" {id}>
	{#if version}
		<div class="sh">
			<h2>{h2}</h2>
			<span class="ver">{version}</span>
		</div>
	{:else}
		<h2>{h2}</h2>
	{/if}
	{@render children()}
</article>

<style>
	.art {
		padding-top: 56px;
		scroll-margin-top: 90px;
	}
	/* Between two articles (each its own component instance). */
	:global(.art + .art) {
		margin-top: 8px;
		border-top: 1px solid var(--hair);
	}
	/* `.art h2`: beats the landing reset's letter-spacing. */
	.art h2 {
		font-size: clamp(26px, 2.6vw, 34px);
		letter-spacing: -0.03em;
		font-weight: 500;
		line-height: 1.1;
	}
	.art > :global(p) {
		margin-top: 14px;
		color: var(--muted);
		font-size: 16.5px;
		line-height: 1.65;
		max-width: 68ch;
	}
	.art > :global(p.sm) {
		font-size: 14.5px;
	}
	.sh {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
	}
	.ver {
		font-family: var(--mono);
		font-size: 12.5px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 8px;
		padding: 4px 9px;
		color: var(--muted);
	}
</style>
