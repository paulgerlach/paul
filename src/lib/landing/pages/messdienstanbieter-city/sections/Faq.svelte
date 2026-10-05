<script lang="ts">
	import Faq from "$lib/landing/sections/Faq.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<Faq items={content.faq} />
