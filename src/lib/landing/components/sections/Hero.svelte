<script lang="ts">
	import poster from "$lib/assets/landing/demo-poster.jpg?url";
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import { focusSignup, HERO_EMAIL_ID, START_HREF } from "../../cta";
	import Check from "../icons/Check.svelte";
	import SignupForm from "../SignupForm.svelte";
	import HeroCard from "./HeroCard.svelte";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();

	const benefits = [
		"Kein Warten aufs Vertragsende",
		"Persönlicher Ansprechpartner",
		"Kündigung übernehmen wir",
	];

	let video = $state<HTMLVideoElement>();
	// Autoplay may be refused (e.g. power saving); the poster stays then.
	const play = () => video?.play().catch(() => {});
	const pause = () => video?.pause();
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
			<ul class="easy">
				{#each benefits as benefit (benefit)}
					<li><i><Check /></i>{benefit}</li>
				{/each}
			</ul>
			<a
				class="demo-card"
				href={START_HREF}
				onclick={focusSignup}
				onmouseenter={play}
				onfocus={play}
				ontouchstart={play}
				onmouseleave={pause}
				onblur={pause}
			>
				<span class="dc-ph">
					<video
						bind:this={video}
						{poster}
						muted
						loop
						playsinline
						preload="metadata"
						aria-hidden="true"
					>
						<source src="/landing/demo.webm" type="video/webm" />
						<source src="/landing/demo.mp4" type="video/mp4" />
					</video>
				</span>
				<span>Demo mit unserem Team buchen</span>
				<i aria-hidden="true">→</i>
			</a>
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
	.easy {
		list-style: none;
		margin: 20px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px 22px;
		font-size: 15px;
	}
	.easy li {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.easy i {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		display: inline-grid;
		place-items: center;
		flex: none;
	}
	.easy i :global(svg) {
		width: 10px;
	}
	.demo-card {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-top: 24px;
		align-self: flex-start;
		background: #edefee;
		border-radius: 8px;
		padding: 4px 16px 4px 4px;
		color: var(--ink);
		font-size: 15px;
		transition: background 0.2s;
	}
	.demo-card:hover {
		background: #e3e7e5;
	}
	.dc-ph {
		width: 48px;
		height: 40px;
		border-radius: 6px;
		overflow: hidden;
		flex: none;
		display: block;
	}
	.demo-card video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.demo-card i {
		font-style: normal;
		color: var(--muted);
		transition: transform 0.2s;
	}
	.demo-card:hover i {
		transform: translateX(3px);
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
		.easy {
			justify-content: center;
		}
		.demo-card {
			align-self: center;
		}
	}
</style>
