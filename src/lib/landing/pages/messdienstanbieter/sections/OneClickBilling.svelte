<script lang="ts">
	import OneClickBilling from "$lib/landing/sections/region/OneClickBilling.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<OneClickBilling {content} />
