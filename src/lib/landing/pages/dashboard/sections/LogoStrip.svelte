<!-- The shared logo strip with the design's label (`.db-logos`). -->
<script lang="ts">
	import LogoStrip from "$lib/landing/sections/LogoStrip.svelte";
	import { logos } from "../content";
</script>

<div class="sec strip">
	<LogoStrip text={logos.text} strong={logos.strong} />
</div>

<style>
	.strip :global(section.logos) {
		padding-block: 56px 64px;
	}
	.strip :global(section.logos p) {
		color: var(--faint);
		font-size: 16px;
	}
	.strip :global(section.logos p b) {
		color: var(--ink);
		font-weight: 500;
	}
</style>
