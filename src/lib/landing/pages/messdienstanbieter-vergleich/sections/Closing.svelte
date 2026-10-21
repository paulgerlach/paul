<!--
  The design's dark closing card (.dm-end with #dcta-css) with its video
  button "Demo buchen", which leads to /demo-buchen. The page has no form of its own.
-->
<script lang="ts">
	import DemoVideoButton from "$lib/landing/components/DemoVideoButton.svelte";
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard id="mv-closing-h" title={closing.h2} text={closing.text} final>
	{#snippet action()}
		<DemoVideoButton
			href={closing.button.href}
			label={closing.button.text}
			sub={closing.button.sub}
		/>
	{/snippet}
</CtaCard>
