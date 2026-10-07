<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import DemoCard from "$lib/landing/components/DemoCard.svelte";
	import { HERO_EMAIL_ID } from "$lib/landing/cta";
	import EasyChecks from "$lib/landing/components/EasyChecks.svelte";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";
	import HeroCard from "./HeroCard.svelte";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();

	const benefits = [
		"Kein Warten aufs Vertragsende",
		"Persönlicher Ansprechpartner",
		"Kündigung übernehmen wir",
	];
</script>

<header class="hero">
	<div class="wrap">
		<div class="hero-copy">
			<h1>Messdienst&shy;leister wechseln.<br />So einfach wie nie.</h1>
			<p class="lede">
				Sie schicken uns Ihren Vertrag, Heidi erledigt den Rest. Auch mit
				laufendem Vertrag: Wir werten Ihre bestehenden Zähler sofort aus.
			</p>
			<SignupForm {form} placement="hero" id="start" inputId={HERO_EMAIL_ID} />
			<EasyChecks items={benefits} />
			<DemoCard />
		</div>
		<HeroCard />
	</div>
</header>

<style>
	.hero .wrap {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		padding-block: 40px;
		align-items: stretch;
	}
	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-block: 40px;
	}
	h1 {
		font-size: clamp(36px, 4.2vw, 60px);
		line-height: 1.02;
		letter-spacing: -0.035em;
	}
	.lede {
		color: var(--muted);
		font-size: clamp(17px, 1.6vw, 21px);
		margin-top: 22px;
		max-width: 34ch;
	}
	@media (max-width: 980px) {
		.hero .wrap {
			grid-template-columns: 1fr;
			text-align: center;
		}
		.hero-copy {
			align-items: center;
			padding-block: 24px 0;
		}
		.lede {
			max-width: none;
		}
	}
</style>
