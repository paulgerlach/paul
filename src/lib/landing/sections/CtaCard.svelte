<!--
  The designs' dark closing card (.dm-end / .dm-cta): a heading and a light
  ArrowLink (/karriere, /hilfe). With `text`, the heading gets the line under
  it and the card the `#dcta-css` spacing; `action` replaces the ArrowLink
  (/funktionen's signup form).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";

	let {
		id,
		title,
		text,
		cta,
		action,
		sectionId,
		final = false,
	}: {
		/** The heading's id, for the section's `aria-labelledby`. */
		id: string;
		title: string;
		text?: string;
		cta?: { text: string; href: string };
		/** Rendered in place of the ArrowLink. */
		action?: Snippet;
		/** Anchor of the section (`start` where it holds the page's form). */
		sectionId?: string;
		/** `final`: the floating CTA hides while the card is in view. */
		final?: boolean;
	} = $props();
</script>

<section class={["end", final && "final"]} id={sectionId} aria-labelledby={id}>
	<div class="wrap">
		<div class={["cta rv", text && "has-text"]}>
			{#if text}
				<div class="t">
					<h2 {id}>{title}</h2>
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
	@media (max-width: 640px) {
		.cta {
			padding: 40px 22px;
		}
		.cta.has-text {
			padding: 32px 22px;
		}
	}
</style>
