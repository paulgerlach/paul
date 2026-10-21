<!--
  The design's dark closing card with its text and the video button "Live
  Demo buchen", which leads to /demo-buchen. After the grey FAQ band the
  design gives it 110 px of top padding.
-->
<script lang="ts">
	import DemoVideoButton from "$lib/landing/components/DemoVideoButton.svelte";
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<div class="pad">
	<CtaCard id="es-closing-h" title={closing.h2} text={closing.text} final>
		{#snippet action()}
			<DemoVideoButton
				href={closing.button.href}
				label={closing.button.text}
				sub={closing.button.sub}
			/>
		{/snippet}
	</CtaCard>
</div>

<style>
	.pad :global(section.end) {
		padding-top: 110px;
	}
</style>
