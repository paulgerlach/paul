<!-- Hero: eyebrow, the big H1, and the lead with the two buttons pushed to the right. `#start`, as in the design. -->
<script lang="ts">
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";
	import Buttons from "../components/Buttons.svelte";
	import { hero } from "../content";
</script>

<section class="intro" id="start" aria-labelledby="vg-h1">
	<div class="wrap">
		<Eyebrow text={hero.eyebrow} class="rv" />
		<h1 data-hs class="rv" id="vg-h1">{hero.h1}</h1>
		<div class="lead rv">
			<p>{hero.lead}</p>
			<Buttons />
		</div>
	</div>
</section>

<style>
	.intro {
		padding: clamp(56px, 7vw, 104px) 0 clamp(40px, 5vw, 72px);
	}
	.wrap {
		max-width: 1280px;
	}
	h1 {
		font-size: clamp(44px, 7vw, 104px);
		line-height: 0.98;
		letter-spacing: -0.045em;
		font-weight: 500;
		margin-top: 22px;
		max-width: 14ch;
		text-wrap: balance;
	}
	.lead {
		max-width: 440px;
		margin: clamp(28px, 4vw, 48px) 0 0 auto;
	}
	.lead p {
		font-size: 17px;
		line-height: 1.55;
		color: var(--muted);
	}
	@media (max-width: 980px) {
		.lead {
			margin-left: 0;
		}
	}
	/* The design's #hs-css (it wins over .ar-h1's own 560 px rule) */
	@media (max-width: 1040px) and (min-width: 621px) {
		h1 {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
	}
	@media (max-width: 620px) {
		h1 {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
	}
</style>
