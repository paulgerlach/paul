<!--
  The dark part of a `uv` page (/plattform/mieterportal, /plattform/verbrauchsinformation): the
  design sets `.uv { background: var(--ink); color: #fff }` on <main>; here it
  wraps the dark sections inside <main>, so the light trust block after it
  stays in <main>. It holds the design's page tokens and its .uv-btn buttons.
-->
<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="uv">{@render children()}</div>

<style>
	.uv {
		background: var(--ink);
		color: #fff;
		--card: #253d37;
		--card2: #2c4841;
		--mute: rgba(255, 255, 255, 0.68);
		--lime: var(--accent);
	}
	.uv :global(:focus-visible) {
		outline-color: var(--accent);
	}

	/* The design's .uv-btn (hero, rows, audience cards) */
	.uv :global(.uv-btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		padding: 13px 18px;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background 0.2s,
			transform 0.15s,
			color 0.2s;
	}
	.uv :global(.uv-btn.w) {
		background: #fff;
		color: var(--ink);
	}
	.uv :global(.uv-btn.w:hover) {
		background: var(--lime);
	}
	.uv :global(.uv-btn.d) {
		background: var(--card2);
		color: #fff;
	}
	.uv :global(.uv-btn.d:hover) {
		background: #365850;
	}
	.uv :global(.uv-btn:active) {
		transform: scale(0.98);
	}
	@media (max-width: 620px) {
		.uv :global(.uv-btn) {
			padding: 12px 15px;
			font-size: 13px;
		}
	}
</style>
