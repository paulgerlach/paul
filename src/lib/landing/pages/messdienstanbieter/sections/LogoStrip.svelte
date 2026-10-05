<script lang="ts">
	import LogoStrip from "$lib/landing/sections/LogoStrip.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<!-- The logos are unconfirmed: see the go-live gate, plan §6.4. -->
<LogoStrip text={content.logoStrip.text} logos={content.logoStrip.logos} />
