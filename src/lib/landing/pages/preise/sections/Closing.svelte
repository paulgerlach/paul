<!-- The design's dark closing card (.dm-end): the heading and "Preise anfragen", back to #anfrage. -->
<script lang="ts">
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard id="pr-closing-h" title={closing.h2} cta={closing.cta} />
