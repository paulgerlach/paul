<!--
  The hero's frame of /dashboard and /auswertung (`.db-hero`): the pill with
  the live dot, the two-line H1, the line below it, the two CTAs and the
  visual (`children`). The line is a snippet, so a page can put chips in it.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { focusSignup } from "$lib/landing/cta";
	import Pill from "./Pill.svelte";

	type Link = { text: string; href: string };

	let {
		pill,
		h1,
		primary,
		secondary,
		line,
		children,
	}: {
		pill: string;
		/** The two parts: the first line and the muted second one. */
		h1: string[];
		primary: Link;
		secondary: Link;
		line: Snippet;
		children?: Snippet;
	} = $props();
</script>

<section class="sec hero" aria-labelledby="db-h1">
	<div class="wrap in">
		<Pill text={pill} live class="rv" />
		<h1 id="db-h1" data-hs class="rv">
			{h1[0]}
			<span>{h1[1]}</span>
		</h1>
		<p class="sub rv">{@render line()}</p>
		<div class="ctas rv">
			<a class="db-btn w" href={primary.href} onclick={focusSignup}
				><i class="sq" aria-hidden="true"></i>{primary.text}</a
			>
			<a class="db-btn k" href={secondary.href} onclick={focusSignup}
				>{secondary.text} <span class="ar" aria-hidden="true">→</span></a
			>
		</div>
		{@render children?.()}
	</div>
</section>

<style>
	.hero {
		padding-top: 84px;
		overflow: hidden;
	}
	.in {
		text-align: center;
	}
	.hero h1 {
		font-size: clamp(40px, 6vw, 80px);
		line-height: 1;
		letter-spacing: -0.045em;
		font-weight: 500;
		margin-top: 26px;
	}
	.hero h1 span {
		display: block;
		color: #8a9792;
	}
	.sub {
		color: var(--muted);
		font-size: clamp(16px, 1.6vw, 20px);
		line-height: 1.6;
		max-width: 760px;
		margin: 24px auto 0;
	}
	@media (min-width: 1000px) {
		.sub {
			max-width: none;
		}
		.sub :global(.l1),
		.sub :global(.l2) {
			display: block;
			white-space: nowrap;
		}
	}
	.ctas {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-top: 36px;
		flex-wrap: wrap;
	}
	@media (max-width: 640px) {
		.hero {
			padding-top: 56px;
		}
	}
</style>
