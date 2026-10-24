<!--
  The dark part of /kunden/private-vermieter (the design's `.pv` on <main>): it
  wraps sections 1–10 inside <main>, so the light trust block after it stays
  in <main>. It holds the page tokens, the two photos the scene, the figures
  and the marquee draw as backgrounds (`--img-room`, `--img-meter`), and the
  design's shared pieces: `.pv-h2`, the `.pv-btn` buttons and `.pv-ctas`.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import room from "$lib/assets/landing/mietverwaltung/apartment.webp?enhanced";
	import meter from "$lib/assets/landing/vorgehen/kitchen-meters.webp?enhanced";

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="pvd"
	style:--img-room="url({room.img.src})"
	style:--img-meter="url({meter.img.src})"
>
	{@render children()}
</div>

<style>
	.pvd {
		background: var(--ink);
		color: #fff;
		--card: #253d37;
		--card2: #2c4841;
		--mute: rgba(255, 255, 255, 0.66);
		--line: rgba(255, 255, 255, 0.12);
		/* The sticky scenes stick below the landing header (measured by them). */
		--top: 65px;
	}
	.pvd :global(.wrap) {
		max-width: 1280px;
	}
	.pvd :global(:focus-visible) {
		outline-color: var(--accent);
	}

	.pvd :global(.pv-h2) {
		font-size: clamp(30px, 3.6vw, 50px);
		font-weight: 400;
		letter-spacing: -0.035em;
		line-height: 1.08;
		margin-top: 16px;
	}
	.pvd :global(.pv-h2.c) {
		text-align: center;
		max-width: 22ch;
		margin-inline: auto;
	}

	.pvd :global(.pv-btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 9px;
		padding: 12px 17px;
		font-size: 13.5px;
		font-weight: 600;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		white-space: nowrap;
		transition:
			background 0.2s,
			color 0.2s,
			transform 0.15s;
	}
	.pvd :global(.pv-btn.w) {
		background: #fff;
		color: var(--ink);
	}
	.pvd :global(.pv-btn.w:hover) {
		background: var(--accent);
	}
	.pvd :global(.pv-btn.d) {
		background: var(--card2);
		color: #fff;
	}
	.pvd :global(.pv-btn.d:hover) {
		background: #365850;
	}
	.pvd :global(.pv-btn:active) {
		transform: scale(0.98);
	}
	.pvd :global(.pv-ctas) {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 24px;
	}
</style>
