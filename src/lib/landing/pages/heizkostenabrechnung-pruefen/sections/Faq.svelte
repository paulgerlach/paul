<!-- The shared FAQ, two-column variant (the design's .dm-faq / .faq2): five questions, all closed. -->
<script lang="ts">
	import Faq from "$lib/landing/sections/Faq.svelte";
	import { faq } from "../content";
</script>

<Faq items={faq.items} title={faq.title} variant="split" />
