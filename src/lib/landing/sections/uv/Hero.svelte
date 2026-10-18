<!--
  The hero of a `uv` page (.uv-hero): the huge word (the H1's accessible text
  is the design's visually hidden sentence), the lead and two CTAs, then a
  strip of three panels bleeding past the page edges: a photo, the page's mock
  and a second photo. Below 620 px only the mock is shown. `size="md"` is the
  design's base layout (word left, lead and CTAs right, /verbrauchsinformation),
  `lg` its extension (word on its own line, lead and CTAs below it side by side,
  /mieterportal).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { Picture } from "vite-imagetools";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import type { Link } from "./types";

	type Photo = { src: Picture; sizes: string; objectPosition?: string };

	let {
		id,
		srTitle,
		word,
		lead,
		primary,
		secondary,
		size = "md",
		photos,
		mock,
	}: {
		/** The H1's id. */
		id: string;
		srTitle: string;
		word: string;
		lead: string;
		primary: Link;
		secondary: Link;
		size?: "md" | "lg";
		/** Left and right of the mock. */
		photos: [Photo, Photo];
		mock: Snippet;
	} = $props();
</script>

{#snippet photo(p: Photo)}
	<figure class="pk ph">
		<Image
			src={p.src}
			alt=""
			loading="eager"
			sizes={p.sizes}
			style={p.objectPosition
				? `object-position: ${p.objectPosition}`
				: undefined}
		/>
	</figure>
{/snippet}

<section class={["hero", size]} aria-labelledby={id}>
	<div class="wrap">
		<div class="top rv">
			<h1 {id}>
				<span class="sr-only">{srTitle}</span>
				<span class="word" aria-hidden="true">{word}</span>
			</h1>
			<div class="sub">
				<p>{lead}</p>
				<div class="ctas">
					<a
						class="uv-btn w"
						href={primary.href}
						onclick={primary.href === START_HREF ? focusSignup : undefined}
						>{primary.text}</a
					>
					<a class="uv-btn d" href={secondary.href}>{secondary.text}</a>
				</div>
			</div>
		</div>
	</div>
	<div class="peek rv">
		{@render photo(photos[0])}
		{@render mock()}
		{@render photo(photos[1])}
	</div>
</section>

<style>
	.hero {
		padding: 48px 0 0;
		overflow: hidden;
	}
	.top {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: end;
		gap: clamp(20px, 4vw, 56px);
	}
	h1 {
		margin: 0;
	}
	.word {
		display: block;
		font-size: clamp(132px, 25vw, 360px);
		font-weight: 400;
		letter-spacing: -0.075em;
		line-height: 0.78;
		margin: 0 0 -0.02em -0.06em;
	}
	.sub {
		padding-bottom: 0.6vw;
		max-width: 520px;
	}
	.sub p {
		margin: 0;
		font-size: clamp(20px, 2.2vw, 32px);
		line-height: 1.18;
		letter-spacing: -0.025em;
	}
	.ctas {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 28px;
	}

	/* size="lg" (the design's .uv-top.lg) */
	.lg .top {
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(22px, 3vw, 40px);
	}
	.lg .word {
		font-size: clamp(40px, 11.4vw, 172px);
		letter-spacing: -0.065em;
		line-height: 0.86;
		margin: 0 0 -0.02em -0.04em;
		white-space: nowrap;
	}
	.lg .sub {
		max-width: none;
		padding-bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 28px;
	}
	.lg .sub p {
		max-width: 620px;
	}
	.lg .ctas {
		margin-top: 0;
		flex: none;
	}

	/* The three panels */
	.peek {
		display: grid;
		grid-template-columns: minmax(0, 0.24fr) minmax(0, 1fr) minmax(0, 0.62fr);
		gap: clamp(14px, 2.4vw, 40px);
		margin: clamp(40px, 6vw, 80px) calc(-1 * clamp(40px, 8vw, 140px)) 0;
		padding-bottom: 110px;
	}
	.pk {
		margin: 0;
		border-radius: 26px;
		overflow: hidden;
		height: clamp(360px, 42vw, 600px);
		position: relative;
	}
	.pk :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 980px) {
		.top {
			grid-template-columns: 1fr;
			gap: 18px;
		}
		.hero .word {
			line-height: 0.8;
		}
		.lg .sub {
			flex-direction: column;
			align-items: flex-start;
		}
		.peek {
			grid-template-columns: minmax(0, 0.12fr) minmax(0, 1fr) minmax(0, 0.12fr);
			margin-inline: calc(-1 * clamp(16px, 4vw, 40px));
		}
	}
	@media (max-width: 620px) {
		.hero {
			padding-top: 28px;
		}
		.lg .word {
			font-size: clamp(34px, 11.6vw, 80px);
		}
		.peek {
			padding-bottom: 72px;
			grid-template-columns: minmax(0, 1fr);
			margin-inline: 0;
		}
		.pk.ph {
			display: none;
		}
	}
</style>
