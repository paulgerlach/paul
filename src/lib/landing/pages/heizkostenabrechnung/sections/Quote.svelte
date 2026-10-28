<!--
  The Vitolus quote over a full-width photo (.hk-q), from the shared
  testimonial data. The photo settles from 106 % once it scrolls into view
  (`enterView`); server-rendered settled.
-->
<script lang="ts">
	import photo from "$lib/assets/landing/cities/koeln/hero.jpg?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { enterView } from "$lib/landing/attachments/enterView";
	import { testimonial } from "$lib/landing/data/testimonials";
	import { quote } from "../content";

	const item = testimonial(quote.key);
	let zoomed = $state(false);
</script>

<section class="q" aria-label={quote.label}>
	<figure
		class={["qf rv", zoomed && "zoom"]}
		{@attach enterView({
			prepare: () => (zoomed = true),
			play: () => {
				zoomed = false;
			},
		})}
	>
		<Image src={photo} alt="" sizes="100vw" width={1100} height={587} />
		<figcaption>
			<span class="qk">{quote.kicker}</span>
			<blockquote>{item.quote}</blockquote>
			<small><b>{item.name}</b> {item.role}</small>
		</figcaption>
	</figure>
</section>

<style>
	.q {
		padding: 0 0 90px;
	}
	.qf {
		position: relative;
		margin: 0;
		height: clamp(420px, 46vw, 620px);
		overflow: hidden;
	}
	.qf :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transform: scale(1);
		transition: transform 2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.qf.zoom :global(img) {
		transform: scale(1.06);
	}
	.qf::after {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(20, 34, 30, 0.55);
	}
	figcaption {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 clamp(20px, 7vw, 110px);
		color: #fff;
		max-width: 1000px;
	}
	.qk {
		font-weight: 600;
		letter-spacing: 0.04em;
		font-size: 18px;
	}
	blockquote {
		margin: 22px 0 0;
		font-size: clamp(24px, 3vw, 42px);
		line-height: 1.18;
		letter-spacing: -0.02em;
	}
	small {
		margin-top: 18px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.75);
	}
	small b {
		color: #fff;
		font-weight: 500;
		margin-right: 6px;
	}
</style>
