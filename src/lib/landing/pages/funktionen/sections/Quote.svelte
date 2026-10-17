<!-- One centred customer quote (.fk-q) from the shared testimonial data. -->
<script lang="ts">
	import VerifiedBadge from "$lib/landing/components/icons/VerifiedBadge.svelte";
	import { testimonial } from "$lib/landing/data/testimonials";
	import Section from "../components/Section.svelte";
	import { quote } from "../content";

	const item = testimonial(quote.key);
</script>

<Section label={quote.label}>
	<figure class="q rv">
		<p class="ver"><VerifiedBadge />{item.badge}</p>
		<blockquote>{item.quote}</blockquote>
		<figcaption>
			<span class="av" aria-hidden="true">{item.initials}</span>
			<span><b>{item.name}</b>{item.role}</span>
		</figcaption>
	</figure>
</Section>

<style>
	.q {
		max-width: 900px;
		margin: 0 auto;
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
		font-size: clamp(22px, 2.4vw, 32px);
		line-height: 1.3;
		letter-spacing: -0.02em;
		font-weight: 500;
		margin: 22px 0 0;
	}
	figcaption {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-top: 28px;
		text-align: left;
		font-size: 14px;
		color: var(--muted);
	}
	figcaption b {
		display: block;
		color: var(--ink);
		font-size: 15.5px;
	}
	.av {
		width: 44px;
		height: 44px;
		flex: none;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 14px;
	}
</style>
