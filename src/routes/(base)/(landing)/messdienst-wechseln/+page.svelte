<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Audience from "$lib/landing/pages/messdienstwechsel/sections/Audience.svelte";
	import CtaCard from "$lib/landing/pages/messdienstwechsel/sections/CtaCard.svelte";
	import Faq from "$lib/landing/pages/messdienstwechsel/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/messdienstwechsel/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/messdienstwechsel/sections/Hero.svelte";
	import Numbers from "$lib/landing/pages/messdienstwechsel/sections/Numbers.svelte";
	import Picture from "$lib/landing/pages/messdienstwechsel/sections/Picture.svelte";
	import Planner from "$lib/landing/pages/messdienstwechsel/sections/Planner.svelte";
	import Quotes from "$lib/landing/pages/messdienstwechsel/sections/Quotes.svelte";
	import Rotator from "$lib/landing/pages/messdienstwechsel/sections/Rotator.svelte";
	import Rows from "$lib/landing/pages/messdienstwechsel/sections/Rows.svelte";
	import Statement from "$lib/landing/pages/messdienstwechsel/sections/Statement.svelte";
	import Trust from "$lib/landing/pages/messdienstwechsel/sections/Trust.svelte";
	import Vollmacht from "$lib/landing/pages/messdienstwechsel/sections/Vollmacht.svelte";
	import UvMain from "$lib/landing/sections/uv/UvMain.svelte";

	let { data } = $props();

	// SSR and hydration render the planner and the Vollmacht's date from the
	// server's time; the browser's clock takes over on mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
</script>

<main id="content" class="mw" {@attach reveal()}>
	<UvMain>
		<Hero />
		<Statement />
		<Rows />
		<Rotator />
		<Numbers />
		<Audience />
		<Quotes />
		<Picture />
		<Planner />
		<Vollmacht />
		<Faq items={data.faq} />
		<CtaCard />
	</UvMain>
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.mw {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.mw :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.mw :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}

	/* #hs-css: the section H2s with an id (Zahlen, quotes, the planner, the
	   Vollmacht, the security block), between 621 and 1040 px and below. The
	   FAQ's H2 gets them in its wrapper. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.mw :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.mw :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
