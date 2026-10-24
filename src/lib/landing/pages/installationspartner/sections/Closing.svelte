<!--
  The design's glass closing card: the title and "Partner werden →" to the
  partner form. No signup form on this page (plan, Key decisions).
-->
<script lang="ts">
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard
	id="ip-closing-h"
	title={closing.h2}
	cta={closing.cta}
	tone="glass"
	final
/>
