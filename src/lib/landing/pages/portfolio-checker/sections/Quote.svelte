<!-- The Werne quote (.pg-sec, .pc-quote): the verified line, the quote and its logo caption, from the shared testimonial data. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import VerifiedBadge from "$lib/landing/components/icons/VerifiedBadge.svelte";
	import { customerLogos } from "$lib/landing/data/logos";
	import { testimonial } from "$lib/landing/data/testimonials";
	import { quote } from "../content";

	const t = testimonial(quote.key);
	const logo = customerLogos[quote.logo];
</script>

<section class="pg-sec" aria-label={quote.label}>
	<div class="wrap">
		<figure class="q rv">
			<span class="ver"><VerifiedBadge />{t.badge}</span>
			<blockquote>{t.quote}</blockquote>
			<figcaption>
				<Image src={logo.src} alt={logo.alt} class="logo" />
				<span><b>{t.name}</b>{t.role}</span>
			</figcaption>
		</figure>
	</div>
</section>

<style>
	.q {
		margin: 0 auto;
		max-width: 860px;
		text-align: center;
	}
	.ver {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13px;
		font-weight: 600;
		color: #2f6eb0;
	}
	.ver :global(svg) {
		width: 18px;
		height: 18px;
	}
	blockquote {
		font-size: clamp(20px, 2vw, 28px);
		line-height: 1.4;
		letter-spacing: -0.02em;
		margin: 18px 0 0;
	}
	figcaption {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-top: 20px;
		font-size: 14px;
		color: var(--muted);
	}
	figcaption :global(.logo) {
		height: 34px;
		width: auto;
	}
	figcaption b {
		display: block;
		color: var(--ink);
	}
</style>
