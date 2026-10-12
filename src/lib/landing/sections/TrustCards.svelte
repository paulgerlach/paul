<!--
  "Partner und Verbände" as cards (DEUMESS, VDIV, bved), on /messdienstwechsel
  and /ueber-uns. The other landing pages use the plain logo row of
  $lib/landing/sections/Trust.svelte.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import bved from "$lib/assets/landing/partners/bved.webp?enhanced";
	import deumess from "$lib/assets/landing/partners/deumess.webp?enhanced";
	import vdiv from "$lib/assets/landing/partners/vdiv.webp?enhanced";
	import { reveal } from "$lib/landing/attachments/reveal";

	let {
		more,
	}: {
		/** Link after the subline ("Mehr über Heidi"); none on /ueber-uns itself. */
		more?: { text: string; href: string };
	} = $props();

	const partners = [
		{
			logo: deumess,
			class: "t-deumess",
			alt: "DEUMESS – energie.daten.netzwerk.",
			name: "DEUMESS",
			text: "Verband unabhängiger Messdienstleister",
		},
		{
			logo: vdiv,
			class: "t-vdiv",
			alt: "VDIV Kooperationspartner Bund",
			name: "VDIV",
			text: "Kooperationspartner Bund",
		},
		{
			logo: bved,
			class: "t-bved",
			alt: "bved – Bundesverband für Energie- und Wasserdatenmanagement e.V.",
			name: "bved",
			text: "Energie- und Wasserdatenmanagement",
		},
	];
</script>

<section class="trust" aria-labelledby="trust-h">
	<div class="wrap">
		<h2 id="trust-h">Ihr Messdienst verdient verlässliche Partner.</h2>
		<p class="t-sub">
			Heidi ist in den Verbänden der Immobilien- und Messdienstbranche vernetzt.
			{#if more}
				<a class="t-more" href={more.href}>
					{more.text}
					<svg
						viewBox="0 0 14 14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						aria-hidden="true"><path d="M4 10L10 4M5 4h5v5" /></svg
					>
				</a>
			{/if}
		</p>
		<div class="t-cards" {@attach reveal(".t-it", { threshold: 0.2 })}>
			{#each partners as partner (partner.name)}
				<div class="t-it">
					<div class="t-lg">
						<Image class={partner.class} src={partner.logo} alt={partner.alt} />
					</div>
					<b>{partner.name}</b>
					<span>{partner.text}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.trust {
		padding: 110px 0 120px;
		background: #f6f7f6;
		text-align: center;
	}
	h2 {
		font-size: clamp(26px, 2.8vw, 38px);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.2;
		margin: 0 auto;
		max-width: 30ch;
	}
	.t-sub {
		font-size: 16px;
		color: var(--muted);
		margin: 18px auto 0;
		max-width: 60ch;
		line-height: 1.5;
	}
	.t-more {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-left: 6px;
		font-weight: 600;
		color: var(--ink);
		white-space: nowrap;
	}
	.t-more svg {
		width: 13px;
		height: 13px;
		transition: transform 0.25s;
	}
	.t-more:hover svg {
		transform: translate(2px, -2px);
	}
	.t-cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
		max-width: 1000px;
		margin: 64px auto 0;
	}
	.t-it {
		background: #fff;
		border-radius: 22px;
		padding: 40px 24px 34px;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: box-shadow 0.3s;
	}
	.t-it:hover {
		box-shadow: 0 18px 40px -26px rgba(30, 50, 45, 0.35);
	}
	.t-it:global(.rv-anim) {
		transition:
			opacity 0.6s,
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.3s;
	}
	.t-it:global(.rv-anim):nth-child(2) {
		transition-delay: 0.12s;
	}
	.t-it:global(.rv-anim):nth-child(3) {
		transition-delay: 0.24s;
	}
	.t-it:global(.rv-wait) {
		opacity: 0;
		transform: translateY(12px);
	}
	.t-lg {
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.t-lg :global(img) {
		display: block;
		width: auto;
		max-width: 100%;
		transition: transform 0.3s;
	}
	.t-it:hover .t-lg :global(img) {
		transform: scale(1.04);
	}
	.t-lg :global(.t-deumess) {
		height: 46px;
	}
	.t-lg :global(.t-vdiv) {
		height: 64px;
	}
	.t-lg :global(.t-bved) {
		height: 60px;
	}
	.t-it b {
		display: block;
		font-size: 19px;
		font-weight: 700;
		margin-top: 26px;
	}
	.t-it span {
		display: block;
		font-size: 16px;
		color: var(--muted);
		margin-top: 6px;
		line-height: 1.4;
	}

	@media (max-width: 820px) {
		.trust {
			padding: 72px 0 84px;
		}
		.t-cards {
			grid-template-columns: minmax(0, 1fr);
			max-width: 420px;
			margin-top: 40px;
			gap: 14px;
		}
		.t-it {
			padding: 30px 20px 26px;
		}
		.t-lg {
			height: 80px;
		}
	}
	@media (max-width: 620px) {
		h2 {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
	@media (max-width: 1040px) and (min-width: 621px) {
		h2 {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
</style>
