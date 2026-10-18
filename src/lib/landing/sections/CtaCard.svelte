<!--
  The designs' dark closing card (.dm-end / .dm-cta): a heading and a light
  ArrowLink (/karriere, /hilfe). With `text`, the heading gets the line under
  it and the card the `#dcta-css` spacing; `action` replaces the ArrowLink
  (the signup form on /funktionen and /mieterportal, styled here for the dark
  card). `tone="glass"` is the translucent card of a dark page (/mieterportal,
  the design's `#end-css`). `visual` is drawn below, across the card (the
  chart on /dashboard).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";

	let {
		id,
		title,
		accent,
		text,
		cta,
		action,
		visual,
		sectionId,
		final = false,
		tone = "dark",
	}: {
		/** The heading's id, for the section's `aria-labelledby`. */
		id: string;
		title: string;
		/** Rendered after the title in a span (/dashboard's muted second part). */
		accent?: string;
		text?: string;
		cta?: { text: string; href: string };
		/** Rendered in place of the ArrowLink. */
		action?: Snippet;
		/** Full width at the bottom of the card. */
		visual?: Snippet;
		/** Anchor of the section (`start` where it holds the page's form). */
		sectionId?: string;
		/** `final`: the floating CTA hides while the card is in view. */
		final?: boolean;
		tone?: "dark" | "glass";
	} = $props();
</script>

<section class={["end", final && "final"]} id={sectionId} aria-labelledby={id}>
	<div class="wrap">
		<div class={["cta rv", text && "has-text", tone === "glass" && "glass"]}>
			{#if text}
				<div class="t">
					<h2 {id}>
						{accent ? `${title} ` : title}{#if accent}<span>{accent}</span>{/if}
					</h2>
					<p>{text}</p>
				</div>
			{:else}
				<h2 {id}>{title}</h2>
			{/if}
			{#if action}
				{@render action()}
			{:else if cta}
				<ArrowLink href={cta.href} label={cta.text} />
			{/if}
			{#if visual}
				<div class="visual">{@render visual()}</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.end {
		padding: 0 0 110px;
		scroll-margin-top: 72px;
	}
	.cta {
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 56px clamp(24px, 5vw, 64px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
	}
	h2 {
		font-size: clamp(26px, 3vw, 40px);
		letter-spacing: -0.03em;
		font-weight: 500;
		max-width: 20ch;
	}
	.cta.glass {
		background: rgba(255, 255, 255, 0.045);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}
	.visual {
		flex: 1 0 100%;
	}
	/* #dcta-css */
	.cta.has-text {
		padding: 52px clamp(24px, 5vw, 64px);
		gap: 28px 40px;
	}
	.t {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 560px;
		flex: 1 1 420px;
	}
	.t h2 {
		max-width: none;
	}
	.t p {
		color: rgba(255, 255, 255, 0.66);
		font-size: 16.5px;
		line-height: 1.5;
		margin: 0;
	}
	/* The signup form (an `action`) is styled for white backgrounds; here it
	   sits on the dark card. */
	.cta :global(.signup-box.final) {
		margin: 0;
		flex: 1 1 380px;
		max-width: 480px;
	}
	.cta :global(.signup) {
		border-color: transparent;
	}
	/* The card's white text would carry into the field. */
	.cta :global(.signup input[type="email"]) {
		color: var(--ink);
	}
	.cta :global(.signup input[type="email"]::placeholder) {
		color: var(--muted);
	}
	.cta :global(.final .status),
	.cta :global(.final .error) {
		text-align: left;
	}
	.cta :global(.final .status) {
		color: var(--accent);
	}
	.cta :global(.final .error) {
		color: #f2b8a0;
	}
	@media (max-width: 640px) {
		.cta {
			padding: 40px 22px;
		}
		.cta.has-text {
			padding: 32px 22px;
		}
	}
</style>
