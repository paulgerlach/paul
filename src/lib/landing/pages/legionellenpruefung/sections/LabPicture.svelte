<!--
  The full-width lab photo with its caption (the design's .lg-pic /
  .lg-big): the photo settles from a slight zoom and the caption's lines
  rise in as it reveals (server-rendered settled). Below 700 px the photo
  sits above the text.
-->
<script lang="ts">
	import photo from "$lib/assets/landing/legionellenpruefung/lab.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { lab } from "../content";
</script>

<section class="pic" aria-labelledby="lg-pic-h">
	<figure class="big rv">
		<div class="ph">
			<Image
				src={photo}
				alt={lab.alt}
				sizes="100vw"
				width={1900}
				height={1069}
			/>
		</div>
		<figcaption class="t">
			<span class="k">{lab.kicker}</span>
			<h2 id="lg-pic-h">{lab.h2}</h2>
			<p>{lab.source}</p>
		</figcaption>
	</figure>
</section>

<style>
	.pic {
		padding: 0 0 clamp(56px, 8vw, 96px);
	}
	.big {
		position: relative;
		margin: 0;
		overflow: hidden;
		min-height: clamp(420px, 46vw, 620px);
		display: flex;
		align-items: center;
		background: var(--ink);
	}
	.big::after {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(18, 32, 28, 0.52);
		pointer-events: none;
	}
	.ph {
		position: absolute;
		inset: 0;
	}
	.ph :global(img) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 70% 50%;
		transition: scale 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.big:global(.rv-wait) .ph :global(img) {
		scale: 1.06;
	}
	.t {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 48px clamp(16px, 4vw, 40px);
		color: #fff;
		text-shadow: 0 1px 18px rgba(0, 0, 0, 0.25);
	}
	.t > * {
		transition:
			opacity 0.7s,
			translate 0.7s;
	}
	.big:global(.rv-wait) .t > * {
		opacity: 0;
		translate: 0 12px;
	}
	.t > :nth-child(2) {
		transition-delay: 0.12s;
	}
	.t > :nth-child(3) {
		transition-delay: 0.24s;
	}
	.k {
		display: block;
		font-size: 17px;
		font-weight: 600;
	}
	/* `.t h2`: beats the landing reset of heading margins. */
	.t h2 {
		margin-top: 22px;
		max-width: 16ch;
		font-size: clamp(30px, 3.6vw, 52px);
		font-weight: 500;
		line-height: 1.08;
		letter-spacing: -0.03em;
		text-wrap: balance;
		color: #fff;
	}
	.t p {
		margin-top: 20px;
		font-size: 15px;
		color: rgba(255, 255, 255, 0.75);
	}
	@media (max-width: 700px) {
		.big {
			display: block;
			min-height: 0;
		}
		.ph {
			position: relative;
			height: 300px;
			overflow: hidden;
		}
		.big::after {
			bottom: auto;
			height: 300px;
			background: rgba(18, 32, 28, 0.18);
		}
		.ph :global(img) {
			object-position: 72% 50%;
		}
		.t {
			padding: 32px 16px 40px;
			text-shadow: none;
		}
		.t h2 {
			max-width: none;
		}
	}
</style>
