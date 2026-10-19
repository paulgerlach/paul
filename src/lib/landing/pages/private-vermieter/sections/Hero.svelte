<!-- The hero (.pv-hero): eyebrow, the three-line H1, and on the right the lead with two buttons. No `#start`: that's the signup form in the closing card. -->
<script lang="ts">
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import { hero } from "../content";
</script>

<section class="hero" aria-labelledby="pv-h1">
	<div class="wrap">
		<Eyebrow class="rv" text={hero.eyebrow} />
		<h1 data-hs class="rv" id="pv-h1">
			{#each hero.h1 as line (line)}{line}<br />{/each}<em>{hero.h1Accent}</em>
		</h1>
		<div class="hr rv">
			<p>{hero.lead}</p>
			<div class="pv-ctas">
				<a
					class="pv-btn w"
					href={hero.primary.href}
					onclick={hero.primary.href === START_HREF ? focusSignup : undefined}
					>{hero.primary.text}</a
				><a class="pv-btn d" href={hero.secondary.href}>{hero.secondary.text}</a
				>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 56px 0 28px;
	}
	/* The size stays plain `h1`, so #hs-css's sizes (the page) win below
	   1040 px as in the design. */
	h1 {
		font-size: clamp(42px, 6vw, 88px);
		line-height: 1;
	}
	/* `.hero h1`: beats the landing reset of heading margins. */
	.hero h1 {
		font-weight: 400;
		letter-spacing: -0.045em;
		margin-top: 18px;
	}
	em {
		font-style: normal;
		color: var(--accent);
	}
	.hr {
		max-width: 440px;
		margin: clamp(28px, 5vw, 56px) 0 0 auto;
	}
	p {
		color: var(--mute);
		font-size: clamp(16px, 1.3vw, 18px);
		line-height: 1.5;
	}
	@media (max-width: 620px) {
		.hr {
			margin-left: 0;
		}
	}
</style>
