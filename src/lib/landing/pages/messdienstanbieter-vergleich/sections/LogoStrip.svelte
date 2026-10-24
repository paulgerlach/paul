<!-- The shared logo strip in the design's `.dm-logos` spacing: 72/64 px, a hairline on top, the 17 px muted label, the row 32 px below. -->
<script lang="ts">
	import LogoStrip from "$lib/landing/sections/LogoStrip.svelte";
	import { logos } from "../content";
</script>

<!-- The logos are unconfirmed: see the go-live gate, plan §4.32. -->
<div class="strip">
	<LogoStrip text={logos.text} logos={logos.order} />
</div>

<style>
	.strip {
		border-top: 1px solid var(--hair);
	}
	.strip :global(section.logos) {
		padding-block: 72px 64px;
	}
	.strip :global(section.logos p) {
		font-size: 17px;
		color: var(--muted);
	}
	.strip :global(section.logos .logo-row) {
		margin-top: 32px;
	}
</style>
