<!--
  Hero (.dm-hero, `#start`): pill, H1, lead, the four points, the Werne quote
  with its logo, and the booking card beside it (sticky above 1040 px). Every
  "Demo buchen" on the page (the nav's, the trust block's) and the closing
  card's button lead here.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { customerLogos } from "$lib/landing/data/logos";
	import { testimonial } from "$lib/landing/data/testimonials";
	import { hero } from "../content";
	import BookingCard from "./BookingCard.svelte";

	// The Werne quote under the list, with the customer's logo.
	const quote = testimonial("werne");
	const logo = customerLogos.werne;
</script>

<section class="hero" id="start" aria-labelledby="dm-h1">
	<div class="wrap grid">
		<div class="copy">
			<span class="pill rv"><i class="live"></i>{hero.pill}</span>
			<h1 data-hs class="rv" id="dm-h1">{hero.h1}</h1>
			<p class="lead rv">{hero.lead}</p>
			<ul class="get rv">
				{#each hero.gets as item (item.title)}
					<li>
						<span class="okb"><Check /></span><span
							><b>{item.title}</b>{item.text}</span
						>
					</li>
				{/each}
			</ul>
			<figure class="quote rv">
				<blockquote>{quote.quote}</blockquote>
				<figcaption>
					<Image src={logo.src} alt={logo.alt} />
					<span><b>{quote.name}</b>{quote.role}</span>
				</figcaption>
			</figure>
		</div>

		<BookingCard />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 96px;
		position: relative;
		overflow: hidden;
		scroll-margin-top: 72px;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
		gap: 64px;
		align-items: start;
		position: relative;
	}
	.copy {
		padding-top: 28px;
	}
	/* `.copy h1`: beats the landing reset of heading margins. */
	.copy h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.02;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	.live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ok);
		position: relative;
		transform-origin: center;
	}
	.live::after {
		content: "";
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 2px solid var(--ok);
		opacity: 0;
		animation: dm-ping 2.2s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
	}
	@keyframes dm-ping {
		0% {
			transform: scale(0.5);
			opacity: 0.7;
		}
		100% {
			transform: scale(1.9);
			opacity: 0;
		}
	}
	/* #pillfx */
	.pill:hover .live {
		animation: pfx-ping 0.9s ease-out;
	}
	@keyframes pfx-ping {
		0% {
			box-shadow: 0 0 0 0 rgba(47, 158, 68, 0.45);
			transform: scale(1);
		}
		40% {
			transform: scale(1.25);
		}
		100% {
			box-shadow: 0 0 0 9px rgba(47, 158, 68, 0);
			transform: scale(1);
		}
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.get {
		list-style: none;
		margin: 32px 0 0;
		padding: 0;
		display: grid;
		gap: 16px;
	}
	.get li {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		font-size: 16px;
		color: var(--muted);
		line-height: 1.45;
	}
	.get .okb {
		width: 24px;
		height: 24px;
		margin-top: 1px;
	}
	.get b {
		display: block;
		color: var(--ink);
		font-weight: 600;
		font-size: 16.5px;
	}
	.quote {
		margin: 40px 0 0;
		padding: 22px 24px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		max-width: 560px;
	}
	blockquote {
		margin: 0;
		font-size: 17px;
		line-height: 1.5;
	}
	figcaption {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 14px;
		font-size: 14px;
		color: var(--muted);
	}
	figcaption :global(img) {
		height: 30px;
		width: auto;
	}
	figcaption b {
		display: block;
		color: var(--ink);
		font-weight: 600;
	}

	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}
		.copy {
			padding-top: 0;
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 64px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.live::after,
		.pill:hover .live {
			animation: none;
		}
	}
</style>
