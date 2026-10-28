<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import AllMeters from "$lib/landing/pages/selbstabrechnung/sections/AllMeters.svelte";
	import Calculator from "$lib/landing/pages/selbstabrechnung/sections/Calculator.svelte";
	import DataPath from "$lib/landing/pages/selbstabrechnung/sections/DataPath.svelte";
	import Duties from "$lib/landing/pages/selbstabrechnung/sections/Duties.svelte";
	import Faq from "$lib/landing/pages/selbstabrechnung/sections/Faq.svelte";
	import FinalCta from "$lib/landing/pages/selbstabrechnung/sections/FinalCta.svelte";
	import FloatingCta from "$lib/landing/pages/selbstabrechnung/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/selbstabrechnung/sections/Hero.svelte";
	import LogoStrip from "$lib/landing/pages/selbstabrechnung/sections/LogoStrip.svelte";
	import People from "$lib/landing/pages/selbstabrechnung/sections/People.svelte";
	import SampleStatement from "$lib/landing/pages/selbstabrechnung/sections/SampleStatement.svelte";
	import TaskSplit from "$lib/landing/pages/selbstabrechnung/sections/TaskSplit.svelte";
	import Testimonials from "$lib/landing/pages/selbstabrechnung/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/selbstabrechnung/sections/Trust.svelte";
</script>

<main id="content" class="sa" {@attach reveal()}>
	<Hero />
	<LogoStrip />
	<TaskSplit />
	<Calculator />
	<DataPath />
	<Duties />
	<AllMeters />
	<SampleStatement />
	<People />
	<Testimonials />
	<Faq />
	<FinalCta />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.sa {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.sa :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.sa :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* The design's #hs-css: larger section H2s between 621 and 1040 px and below */
	@media (max-width: 1040px) and (min-width: 621px) {
		.sa :global(section h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.sa :global(section h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
