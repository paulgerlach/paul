<!--
  Customer references: a large card on the city's own photo, and two small
  quotes. The quotes are the same on every page (roles: plan open question 6).
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import VerifiedBadge from "$lib/landing/components/icons/VerifiedBadge.svelte";
	import { DEMO_HREF, focusSignup, START_HREF } from "$lib/landing/cta";
	import { customerLogos } from "$lib/landing/data/logos";
	import { testimonial } from "$lib/landing/data/testimonials";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();

	const werne = testimonial("werne");
	const minis = [testimonial("vitolus"), testimonial("gerhard")];
</script>

<section class="ref" aria-label="Kundenreferenz">
	<div class="wrap ref-in">
		<figure class="ref-hero">
			<Image
				class="ref-bg"
				src={content.referencesPhoto}
				alt=""
				sizes="(max-width: 1240px) 100vw, 1180px"
			/>
			<div class="ref-main">
				<div class="ref-logo">
					<Image src={customerLogos.werne.src} alt={customerLogos.werne.alt} />
				</div>
				<blockquote>{werne.quote}</blockquote>
				<p class="ref-who">
					<b>{werne.name}</b><span>{werne.role}</span>
				</p>
				<a
					class="ref-btn"
					href={DEMO_HREF}
					onclick={DEMO_HREF === START_HREF ? focusSignup : undefined}
				>
					Demo buchen
					<svg viewBox="0 0 8 12" aria-hidden="true">
						<path
							d="M1.5 1l5 5-5 5"
							stroke="currentColor"
							stroke-width="1.8"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			</div>
		</figure>
		<div class="ref-more">
			{#each minis as mini (mini.name)}
				<figure class="ref-mini">
					<div class="ref-ver"><i><VerifiedBadge /></i>{mini.badge}</div>
					<blockquote>{mini.quote}</blockquote>
					<figcaption><b>{mini.name}</b> · {mini.role}</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<style>
	.ref {
		background: var(--stone);
		padding-block: 110px;
	}
	.ref-in {
		max-width: 1180px;
	}
	figure {
		margin: 0;
	}
	.ref-hero {
		position: relative;
		border-radius: 24px;
		overflow: hidden;
		min-height: 560px;
		display: flex;
		align-items: center;
		background: #2b302e;
	}
	.ref-hero :global(.ref-bg) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 35%;
		max-width: none;
	}
	.ref-hero::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(
			90deg,
			rgba(18, 28, 25, 0.82) 0%,
			rgba(18, 28, 25, 0.62) 45%,
			rgba(18, 28, 25, 0.25) 100%
		);
	}
	.ref-main {
		position: relative;
		z-index: 2;
		color: #fff;
		padding: 64px clamp(24px, 6vw, 96px);
		max-width: 760px;
	}
	.ref-logo {
		height: 46px;
		display: flex;
		justify-content: flex-start;
	}
	.ref-logo :global(img) {
		height: 46px;
		width: auto;
		filter: brightness(0) invert(1);
	}
	.ref-hero blockquote {
		margin: 28px 0 0;
		color: #fff;
		font-size: clamp(24px, 2.8vw, 38px);
		line-height: 1.28;
		letter-spacing: -0.02em;
		max-width: 30ch;
		text-wrap: balance;
	}
	.ref-who {
		margin-top: 24px;
		font-size: 17px;
	}
	.ref-who b {
		font-weight: 600;
	}
	.ref-who span {
		color: rgba(255, 255, 255, 0.75);
		margin-left: 8px;
	}
	.ref-btn {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-top: 32px;
		background: #fff;
		color: var(--ink);
		border-radius: 999px;
		padding: 13px 24px;
		font-weight: 600;
		font-size: 15px;
		transition: gap 0.2s;
	}
	.ref-btn svg {
		width: 8px;
		height: 12px;
	}
	.ref-btn:hover {
		gap: 16px;
	}
	.ref-more {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-top: 56px;
		text-align: left;
	}
	.ref-mini {
		background: #fff;
		border-radius: 16px;
		padding: 22px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.ref-mini blockquote {
		margin: 0;
		font-size: 16px;
		line-height: 1.5;
	}
	.ref-ver {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		align-self: flex-start;
		background: #eef3f0;
		color: #24452f;
		border-radius: 999px;
		padding: 4px 12px 4px 5px;
		font-size: 13px;
		font-weight: 600;
	}
	.ref-ver i {
		width: 20px;
		height: 20px;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ref-ver :global(svg) {
		width: 20px;
		display: block;
	}
	.ref-mini figcaption {
		font-size: 14px;
		color: var(--muted);
		margin-top: auto;
	}
	.ref-mini figcaption b {
		color: var(--ink);
		font-weight: 600;
	}

	@media (max-width: 860px) {
		.ref-hero {
			min-height: 520px;
		}
		.ref-main {
			padding: 40px 24px;
		}
		.ref-hero::before {
			background: rgba(18, 28, 25, 0.68);
		}
	}
	@media (max-width: 760px) {
		.ref-more {
			grid-template-columns: 1fr;
		}
	}
</style>
