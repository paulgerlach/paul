<script lang="ts">
	import type { FaqItem } from "$lib/landing/faqJsonLd";
	import Faq from "$lib/landing/sections/uv/Faq.svelte";
	import { faq } from "../content";

	let { items }: { items: FaqItem[] } = $props();
</script>

<Faq {items} title={faq.title} />
