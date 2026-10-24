<script lang="ts">
	import Faq from "$lib/landing/sections/uv/Faq.svelte";
	import { faq } from "../content";
</script>

<Faq items={faq.items} title={faq.title} />
