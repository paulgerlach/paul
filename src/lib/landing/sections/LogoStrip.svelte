<!--
  Customer logo strip of the landing pages. Each page passes its own claim
  and logo order.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		customerLogos,
		DEFAULT_LOGO_ORDER,
		type LogoKey,
	} from "$lib/landing/data/logos";

	let {
		text,
		placeholder = false,
		logos = DEFAULT_LOGO_ORDER,
	}: {
		text: string;
		/** Marks the claim as unconfirmed (go-live gate). */
		placeholder?: boolean;
		logos?: LogoKey[];
	} = $props();
</script>

<section class="logos wrap" aria-label="Kunden">
	<p data-placeholder={placeholder ? "" : undefined}>{text}</p>
	<div class="logo-row">
		{#each logos as key (key)}
			{@const logo = customerLogos[key]}
			<Image src={logo.src} alt={logo.alt} style="--h:{logo.h}px" />
		{/each}
	</div>
</section>

<style>
	.logos {
		text-align: center;
		padding-block: 88px 40px;
	}
	.logos p {
		font-size: 19px;
		display: inline-block;
	}
	.logo-row {
		display: grid;
		grid-template-columns: repeat(6, auto);
		justify-content: center;
		justify-items: center;
		align-items: center;
		gap: 36px 60px;
		margin-top: 40px;
	}
	.logo-row :global(img) {
		height: calc(var(--h) * 0.78);
		width: auto;
		max-width: 100%;
		object-fit: contain;
		opacity: 0.6;
		transition: opacity 0.2s;
	}
	.logo-row :global(img:hover) {
		opacity: 1;
	}
	@media (max-width: 1100px) {
		.logo-row {
			grid-template-columns: repeat(4, auto);
			gap: 28px 40px;
		}
	}
	@media (max-width: 700px) {
		.logo-row :global(img) {
			height: calc(var(--h) * 0.6);
		}
	}
	@media (max-width: 560px) {
		.logo-row {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 26px 18px;
		}
	}
</style>
