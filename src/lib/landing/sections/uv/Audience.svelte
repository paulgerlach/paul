<!--
  "Sie sind Verwalter?" / "Sie sind Mieter?" (.uv-who): dark cards with a
  square photo, or a mock in its place (`media`), or a block that isn't a
  figure (`panel`: a form). A card's button shows only when its target exists.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import type { AudienceCard } from "./types";

	let {
		idPrefix,
		label,
		cards,
	}: {
		/** Prefix of the cards' heading ids. */
		idPrefix: string;
		label: string;
		cards: AudienceCard[];
	} = $props();
</script>

<section class="who" aria-label={label}>
	<div class="wrap">
		{#each cards as card, i (card.title)}
			<article class="card rv" aria-labelledby="{idPrefix}-{i}">
				<div>
					<h2 id="{idPrefix}-{i}">{card.title}</h2>
					<p>{card.text}</p>
					{#if card.cta.href}
						<a
							class="uv-btn w"
							href={card.cta.href}
							onclick={card.cta.href === START_HREF ? focusSignup : undefined}
							>{card.cta.text}</a
						>
					{/if}
				</div>
				{#if card.image}
					<figure class="photo">
						<Image
							src={card.image}
							alt=""
							sizes="(max-width: 980px) 100vw, 440px"
							style={card.objectPosition
								? `object-position: ${card.objectPosition}`
								: undefined}
						/>
					</figure>
				{:else if card.panel}
					<div>{@render card.panel()}</div>
				{:else}
					<figure class="media">{@render card.media?.()}</figure>
				{/if}
			</article>
		{/each}
	</div>
</section>

<style>
	.who {
		padding: 0 0 110px;
	}
	.card {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: clamp(24px, 5vw, 80px);
		align-items: center;
		background: var(--card);
		border-radius: 26px;
		padding: clamp(24px, 4vw, 52px);
		max-width: 1120px;
		margin: 0 auto 28px;
	}
	/* Beats the landing heading reset (tokens.css). */
	.card h2 {
		font-size: clamp(30px, 3.4vw, 48px);
		font-weight: 400;
		letter-spacing: -0.04em;
	}
	.card p {
		color: var(--mute);
		font-size: clamp(16px, 1.35vw, 19px);
		line-height: 1.5;
		margin: 22px 0 30px;
		max-width: 46ch;
	}
	figure {
		margin: 0;
	}
	.photo {
		border-radius: 20px;
		overflow: hidden;
		aspect-ratio: 1/1;
	}
	.media {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.photo :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	/* The design's .uv-card img: also a mock's images zoom on hover. */
	figure :global(img) {
		display: block;
		transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.card:hover figure :global(img) {
		transform: scale(1.03);
	}
	@media (max-width: 980px) {
		.card {
			grid-template-columns: 1fr;
		}
		.photo {
			aspect-ratio: 16/10;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		figure :global(img) {
			transition: none;
		}
	}
</style>
