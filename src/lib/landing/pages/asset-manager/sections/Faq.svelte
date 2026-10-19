<!-- The shared FAQ, split variant (the design's .dm-faq-g / .faq2). -->
<script lang="ts">
	import type { FaqItem } from "$lib/landing/faqJsonLd";
	import Faq from "$lib/landing/sections/Faq.svelte";
	import { faq } from "../content";

	let { items }: { items: FaqItem[] } = $props();
</script>

<Faq {items} title={faq.title} variant="split" />
