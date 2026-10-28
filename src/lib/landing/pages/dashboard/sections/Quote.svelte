<!-- The Werne quote with its logo (`.db-quote`), from the shared testimonial data. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { customerLogos } from "$lib/landing/data/logos";
	import { testimonial } from "$lib/landing/data/testimonials";
	import { quote } from "../content";

	const t = testimonial(quote.testimonial);
	const logo = customerLogos[quote.logo];
	const [before, after] = t.quote.split(quote.emphasis);
</script>

<section class="sec quote" aria-label={quote.label}>
	<figure class="wrap">
		<Image src={logo.src} alt={logo.alt} class="wl rv" />
		<blockquote class="rv">{before}<em>{quote.emphasis}</em>{after}</blockquote>
		<figcaption class="who rv"><b>{t.name}</b><span>{t.role}</span></figcaption>
	</figure>
</section>

<style>
	.quote {
		padding: 120px 0;
	}
	figure {
		margin: 0 auto;
	}
	figure :global(.wl) {
		height: 36px;
		width: auto;
		margin: 0 auto 22px;
		display: block;
		opacity: 0.85;
	}
	blockquote {
		margin: 0 auto;
		max-width: 980px;
		text-align: center;
		font-size: clamp(24px, 3vw, 40px);
		line-height: 1.25;
		letter-spacing: -0.02em;
		color: #8a9792;
		font-weight: 500;
	}
	em {
		font-style: normal;
		color: var(--ink);
	}
	.who {
		text-align: center;
		margin-top: 30px;
	}
	.who b {
		display: block;
		font-size: 18px;
		font-weight: 600;
	}
	.who span {
		color: var(--muted);
	}
	@media (max-width: 640px) {
		.quote {
			padding: 84px 0;
		}
	}
</style>
