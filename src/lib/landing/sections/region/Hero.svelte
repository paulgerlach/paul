<!-- `header.city-hero` of the region template: copy, signup and the photo with its card stack. -->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import DemoCard from "$lib/landing/components/DemoCard.svelte";
	import EasyChecks from "$lib/landing/components/EasyChecks.svelte";
	import Pin from "$lib/landing/components/icons/Pin.svelte";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";
	import { HERO_EMAIL_ID } from "$lib/landing/cta";
	import HeroPhotoStack from "./HeroPhotoStack.svelte";
	import type { RegionContent } from "./types";

	let {
		content,
		form,
	}: { content: RegionContent; form: SuperValidated<SwitchInquiry> } = $props();
	const hero = $derived(content.hero);
</script>

<header class="city-hero">
	<div class="wrap">
		<div class="hero-copy">
			<span class="city-tag"><i><Pin /></i>{hero.tag}</span>
			<h1>{hero.title}</h1>
			<p class="lede">{hero.lede}</p>
			<SignupForm
				{form}
				placement="hero"
				id="start"
				inputId={HERO_EMAIL_ID}
				submitLabel="Bestand kostenlos prüfen"
			/>
			<EasyChecks items={hero.checks} />
			<DemoCard />
		</div>
		<div class="hero-photo">
			<Image
				src={hero.photo}
				alt={hero.photoAlt}
				sizes="(max-width: 980px) 100vw, 50vw"
				priority
			/>
			<HeroPhotoStack example={content.example} units={hero.units} />
		</div>
	</div>
</header>

<style>
	.wrap {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		gap: 48px;
		padding-block: 40px;
		align-items: stretch;
	}
	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-block: 32px;
	}
	h1 {
		font-size: clamp(36px, 4.2vw, 60px);
		line-height: 1.04;
		letter-spacing: -0.035em;
	}
	.lede {
		color: var(--muted);
		font-size: clamp(17px, 1.5vw, 20px);
		margin-top: 20px;
		max-width: 40ch;
	}
	.city-tag {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		align-self: flex-start;
		background: #eef3f0;
		color: #24452f;
		border-radius: 999px;
		padding: 5px 12px 5px 8px;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 18px;
	}
	.city-tag i {
		position: relative;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		font-style: normal;
	}
	.city-tag i :global(svg) {
		width: 11px;
		display: block;
	}
	.city-tag i::after {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 2px solid var(--accent);
		animation: ct-ring 2.4s ease-out infinite;
	}
	@keyframes ct-ring {
		0% {
			transform: scale(1);
			opacity: 0.9;
		}
		70%,
		100% {
			transform: scale(1.9);
			opacity: 0;
		}
	}
	.hero-photo {
		position: relative;
		border-radius: 18px;
		overflow: hidden;
		min-height: 520px;
		background: #dcd6cb;
	}
	.hero-photo :global(img) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 40%;
		max-width: none;
	}

	@media (max-width: 980px) {
		.wrap {
			grid-template-columns: 1fr;
		}
		.hero-copy {
			align-items: center;
		}
		.hero-photo {
			min-height: 440px;
		}
	}
</style>
