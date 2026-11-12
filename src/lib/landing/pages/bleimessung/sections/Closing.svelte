<!-- The design's dark closing card (.dm-end): the heading and "Bleimessung anfragen", to /kontakt. -->
<script lang="ts">
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard id="pb-closing-h" title={closing.h2} cta={closing.cta} final />
