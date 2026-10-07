<script lang="ts">
	import Trio from "$lib/landing/sections/region/Trio.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<Trio {content} />
