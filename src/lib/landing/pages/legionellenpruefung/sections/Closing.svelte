<!-- The design's dark closing card (.dm-end): the heading and "Prüfung anfragen", to /kontakt. -->
<script lang="ts">
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard id="lg-closing-h" title={closing.h2} cta={closing.cta} final />
